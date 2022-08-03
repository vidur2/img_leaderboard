import { Images } from "@prisma/client";
import { useRouter } from "next/router"
import { createContext, useEffect, useState } from "react"
import styles from "../styles/Home.module.css"
import { ImageJudge, Judgement } from "../types/adminTypes";
import { Rectangle } from "../types/labellingTypes";
import { LoginInformation } from "../types/loginTypes";

const WIDTH  = 1920;
const HEIGHT = 1080;

const imageAddr = "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVuc3xlbnwwfHwwfHw%3D&w=1000&q=80";

async function handleGoodBad(id: number, judgement: Judgement) {
    const body: ImageJudge = {
        judgement,
        id
    }

    await fetch("/api/admin/post_image", {
        method: "POST",
        body: JSON.stringify(body)
    })
}

async function checkLogin(username: string, password: string): Promise<boolean> {
    const res = await fetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({
            username,
            password
        })
    })

    const respFinal = await res.json();

    return respFinal.valid;
}

function drawRect(ctx: CanvasRenderingContext2D, rectangle: Rectangle) {
    ctx.beginPath();

    const x1 = rectangle.x1 * WIDTH;
    const x2 = rectangle.x2 * WIDTH;
    const y1 = rectangle.y1 * HEIGHT;
    const y2 = rectangle.y2 * HEIGHT;

    const width = x1 - x2;
    const height = y1 - y2;
    ctx.clearRect(x2, y2, 5, 5);
    ctx.rect(x1, y1, -width, -height);
    ctx.stroke()
}

async function fetchImg(loginInformation: LoginInformation): Promise<Images | null> {
    const res = await fetch("/api/admin/get_image", {
        method: "POST",
        body: JSON.stringify(loginInformation)
    })

    const resJson = await res.json();

    return resJson.image;
}

const VerifyImage = () => {
    const router = useRouter()
    const [src, setSrc] = useState("");
    const [id, setId] = useState(-1);

    useEffect(() => {
        const username = window.sessionStorage.getItem("username");
        const password = window.sessionStorage.getItem("password");

        if (username != null && password != null) {
            checkLogin(username, password).then((valid) => {
                if (!valid) {
                    window.sessionStorage.clear();
                    router.push("/login")
                } else if (src === "") {
                    const loginInformation: LoginInformation = {
                        username,
                        password
                    };
    
                    fetchImg(loginInformation).then((img) => {
                        const background = new Image();

                        if (img != null) {
                            background.src = img.data
                            setSrc(img.data)
                            setId(img.id)
                        } else {
                            background.src = imageAddr
                        }
    
    
                        const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
                        const ctx = canvas.getContext("2d");
    
                        canvas.width = WIDTH
                        canvas.height = HEIGHT
    
                        background.onload = () => {
                            ctx.drawImage(background, 0, 0);
                            if (img != null ) {
                                img.rectangles.forEach((rect) => {
                                    const rectParsed: Rectangle = JSON.parse(rect);
                                    console.log(rectParsed)
                                    drawRect(ctx, rectParsed);
                                })
                            }
                        }
                    })
                }
            })
        } else {
            router.push("/login")
        }
    })

    const getNextBg = async() => {
        const username = window.sessionStorage.getItem("username");
        const password = window.sessionStorage.getItem("password")

        if (username != null && password != null) {
            const loginInformation: LoginInformation = {
                username,
                password
            }

            const img = await fetchImg(loginInformation)

            if (img != null) {
                setSrc(img.data)
                setId(img.id)

                const background = new Image()

                background.src = img.data

                const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
                const ctx = canvas.getContext("2d")

                canvas.width = WIDTH;
                canvas.height = HEIGHT;

                background.onload = () => {
                    ctx.drawImage(background, 0, 0);
                    img.rectangles.forEach((rect) => {
                        const rectParsed: Rectangle = JSON.parse(rect);
                        console.log(rectParsed)
                        drawRect(ctx, rectParsed);
                    })
                }
            } else {
                const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
                const ctx = canvas.getContext("2d")

                const background = new Image();
                
                background.src = imageAddr;

                canvas.width = WIDTH;
                canvas.height = HEIGHT;

                background.onload = () => {
                    ctx.drawImage(background, 0, 0);
                    img.rectangles.forEach((rect) => {
                        const rectParsed: Rectangle = JSON.parse(rect);
                        console.log(rectParsed)
                        drawRect(ctx, rectParsed);
                    })
                }
            }
        }
    }

    const onGood = async() => {
        await handleGoodBad(id, Judgement.Good)
        await getNextBg()
    }

    const onBad = async() => {
        await handleGoodBad(id, Judgement.Bad)
        await getNextBg()
    }

    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <canvas id="imgCanvas"></canvas>
                <table>
                    <td><button onClick={onGood}>Good</button></td>
                    <td><button onClick={onBad}>Bad</button></td>
                </table>
            </main>
        </div>
    )
}

export default VerifyImage