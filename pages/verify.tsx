import styles from "../styles/Home.module.css"
import { useEffect } from "react";
import { useRouter } from "next/router";
import { VerificationReq } from "../types/loginTypes";

const VerifyPage = () => {
    const router = useRouter();

    useEffect(() => {
        const body = parseWindow(window)

        fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(body)
        }).then((res) => {
            res.json().then((status) => {
                if (status.valid) {
                    window.sessionStorage.setItem("username", status.username)
                    window.sessionStorage.setItem("password", status.password)
                    router.push("/label")
                } else {
                    window.sessionStorage.clear();
                    router.push("/sign_up")
                }
            })
        })
    })
    return (
        <div className={styles.container}>
            <main className={styles.main}>
                <h1 id="displayText">Verifying Token</h1>
            </main>
        </div>
    )
}

function parseWindow(window: Window): VerificationReq {
    const url = window.location.href;
    const jwt = url.split("?")[1]

    return {
        jwt
    }
}

export default VerifyPage;