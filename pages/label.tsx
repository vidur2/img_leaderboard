import { NextPage } from "next"
import Head from "next/head";
import { Rectangle, ImageRes, ImagePost } from "../types/labellingTypes";
import React, { MouseEvent, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import { NextRouter, useRouter } from "next/router";
import { LoginInformation } from "../types/loginTypes";
import { Images } from "@prisma/client";

const imageAddr = "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8bGVuc3xlbnwwfHwwfHw%3D&w=1000&q=80";
const WIDTH  = 1920;
const HEIGHT = 1080;

let rectangles = new Array();

const LabelPage: NextPage = () => {
    const router = useRouter();

    let prevX: number | undefined;
    let prevY: number | undefined;

    let [src, setSrc] = useState("");
    let [id, setId] = useState(-1);

    const mouseDownHandle = (event: MouseEvent<HTMLCanvasElement>) => {
        const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
        const rect = canvas?.getBoundingClientRect();

        if (rect != undefined) {
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
    
            if (prevX != undefined && prevY != undefined) {
                const newRect: Rectangle = {
                    x1: x,
                    y1: y,
                    x2: prevX,
                    y2: prevY,
                }

                rectangles.push(scaleRect(newRect));
                // setRectangles(rectangles);

                if (canvas != undefined) {
                    const ctx = canvas.getContext("2d");
                    drawRect(ctx, newRect)
                }

                prevX = undefined;
                prevY = undefined;
                // generateRect(document, rectangles)
            } else if (canvas != undefined) {
                const ctx = canvas.getContext("2d")
                ctx.fillRect(x, y, 5, 5);
                prevX = x;
                prevY = y;
            }
        }
    }

    const refreshBtn = (_event) => {
        rectangles = new Array()
        // generateRect(document, rectangles)
        const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;

        if (canvas != undefined) {
            const ctx = canvas.getContext("2d");
            canvas.width = WIDTH;
            canvas.height = HEIGHT;


            const background = new Image();
            background.src = src;

            // Make sure the image is loaded first otherwise nothing will draw.
            background.onload = function(){
                ctx.drawImage(background,0,0);  
            }
        }
    }

    useEffect(() => {
        const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;

        const image = fetchImage(window, router)
        if (src === "") {
            if (canvas != undefined) {
                const ctx = canvas.getContext("2d");
                canvas.width = WIDTH;
                canvas.height = HEIGHT;
                const submitButton = document.getElementById("submitButton") as HTMLButtonElement
    
                image.then((img) => {
                    if (img != null) {
                        submitButton.disabled = false
                        setSrc(img.data);
                        setId(img.id)
                        const background = new Image();
                        background.src = img.data;
    
                        // Make sure the image is loaded first otherwise nothing will draw.
                        background.onload = function(){
                            ctx.drawImage(background,0,0);   
                        }
                    } else {
                        setSrc(imageAddr)
                        const background = new Image();
                        background.src = imageAddr
                        background.onload = function(){
                            ctx.drawImage(background,0,0);   
                        }
                        submitButton.disabled = true;
                    }
                })
            }
        }
    })

    const submitRect = async(event) => {
        // TODO POST req here
        const postArr: string[] = new Array();

        for (let i = 0; i < rectangles.length; i++) {
            postArr.push(JSON.stringify(rectangles[i]))
        }

        rectangles = new Array();

        const body: ImagePost = {
            rectangles: postArr,
            id,
            username: window.sessionStorage.getItem("username")
        }

        await fetch("/api/post_image", {
            method: "POST",
            body: JSON.stringify(body)
        })

        const newImg = await fetchImage(window, router);
        setSrc(newImg.data)
        setId(newImg.id)

        refreshBtn(event)
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Label Image</title>
            </Head>

            <main className={styles.main}>
                <table>
                    <tr>
                        <td>
                        <canvas id="imgCanvas" onMouseDown={mouseDownHandle}></canvas>
                        </td>
                        <td>
                        <div id="deleteHandler"></div>
                        </td>
                    </tr>
                </table>
                <button onClick={refreshBtn}>Clear Canvas</button>
                <button id="submitButton" onClick={submitRect}>Submit</button>
            </main>
        </div>
    )
}

function scaleRect(rectangle: Rectangle): Rectangle {
    const retRect: Rectangle = {
        x1: rectangle.x1/WIDTH,
        x2: rectangle.x2/WIDTH,
        y1: rectangle.y1/HEIGHT,
        y2: rectangle.y2/HEIGHT
    }

    return retRect
}

function drawRect(ctx: CanvasRenderingContext2D, rectangle: Rectangle) {
    ctx.beginPath();
    const width = rectangle.x1 - rectangle.x2;
    const height = rectangle.y1 - rectangle.y2;
    ctx.clearRect(rectangle.x2, rectangle.y2, 5, 5);
    ctx.rect(rectangle.x1, rectangle.y1, -width, -height);
    ctx.stroke()
}

function generateRect(document: Document, rectangles: Array<Rectangle>) {
    const outerElem = document.getElementById("deleteHandler")
    outerElem.innerHTML = ""
    for (let i = 0; i < rectangles.length; i ++) {
        const rect = rectangles[i]
        outerElem.innerHTML += `<p>(${rect.x1, rect.y1}), (${rect.x2, rect.y2})</p>`
        const btn = document.createElement("span")
        btn.innerHTML = `<button id=${i}>Delete Elem</button>`
        btn.onclick = deleteElem
        outerElem.appendChild(btn)
    }
}

async function fetchImage(window: Window, router: NextRouter): Promise<Images | null> {
    const username = window.sessionStorage.getItem("username");
    const password = window.sessionStorage.getItem("password");

    if (username == null || password == null) {
        router.push("/login")
        return
    }

    const body: LoginInformation = {
        username,
        password
    }

    const res = await fetch("/api/get_image", {
        method: "POST",
        body: JSON.stringify(body)
    })

    if (res.status == 200) {
        const body: ImageRes = await res.json()

        if (body.valid) {
            return body.image
        } else {
            return
        }
    } else {
        window.sessionStorage.clear();
        router.push("/login");
        return
    }
}

function deleteElem(event: any) {
    const id = event.target.id
    rectangles.splice(id, 1)
    generateRect(document, rectangles)
}

export default LabelPage;