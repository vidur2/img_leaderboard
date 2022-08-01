import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/Home.module.css"
import { LoginInformation } from "../types/loginTypes";

const SignUp = () => {
    const router = useRouter();

    useEffect(() => {
        if (window.sessionStorage.getItem("username") != null && window.sessionStorage.getItem("password") != null) {
            router.push("/label")
        }
    })

    const handleSignUp = async(event) => {
        event.preventDefault()
        const username = event.target.username.value;
        const password = event.target.password.value;
        const confirmed = event.target.confirm.value;

        if (password === confirmed) {
            console.log("shit1")
            const signUpInfo: LoginInformation = {
                username,
                password
            }

            await fetch("/api/sign_up", {
                method: "POST",
                body: JSON.stringify(signUpInfo)
            })

            const main = document.getElementById("mainBody");
            main.innerHTML = "<h1>Check your inbox for a verification email<h1>"
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Sign Up</title>
            </Head>
            <main id="mainBody" className={styles.main}>
                <form onSubmit={handleSignUp}>
                <p>Email: <input id="username" type="text"></input></p>
                <p>Password: <input id="password" type="password"></input></p>
                <p>Confirm: <input id="confirm" type="password"></input></p>
                <button type="submit">Submit</button>
                </form>
            </main>
        </div>
    )
}

export default SignUp;