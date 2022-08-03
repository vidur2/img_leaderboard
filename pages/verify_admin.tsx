import styles from "../styles/Home.module.css"
import { useEffect } from "react";
import { useRouter } from "next/router";
import { VerificationReq } from "../types/loginTypes";

const VerifyPage = () => {
    const router = useRouter();

    useEffect(() => {
        const body = parseWindow(window)

        fetch("/api/admin/verify", {
            method: "POST",
            body: JSON.stringify(body)
        }).then((res) => {
            res.json().then((status) => {
                const statusText = document.getElementById("displayText")
                if (status.valid) {
                    statusText.innerHTML = "Success"
                } else {
                    window.sessionStorage.clear();
                    status.innerHTML = "Bad JWT"
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