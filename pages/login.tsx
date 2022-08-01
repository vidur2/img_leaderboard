import Head from "next/head"
import { NextRouter, useRouter } from "next/router"
import { useEffect } from "react";
import styles from "../styles/Home.module.css"
import { LoginInformation } from "../types/loginTypes";

const Login = () => {
    const router = useRouter();

    const handleSubmit = async(event) => {
        event.preventDefault();

        const username = event.target.username.value;
        const password = event.target.password.value;

        await login(username, password, router, window);
    }

    useEffect(() => {
        const username = window.sessionStorage.getItem("username");
        const password = window.sessionStorage.getItem("password");
        
        if (username != null && password != null){
            login(username, password, router, window)
        }
    })

    return (
        <div className={styles.container}>
            <Head>
                <title>Login</title>
            </Head>
            <main className={styles.main}>
                <form onSubmit={handleSubmit}>
                    <p>Username: <input type="text" id="username"></input></p>
                    <p>Password: <input type="text" id="password"></input></p>
                    <button type="submit">Submit</button>
                </form>
            </main>
        </div>
    )
}

async function login(username: string, password: string, router: NextRouter, window: Window) {
    const body: LoginInformation = {
        username,
        password
    }
    const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify(body)
    })

    if (res.status == 200) {
        window.sessionStorage.setItem("username", username);
        window.sessionStorage.setItem("password", password)
        router.push("/label")
    } else {
        window.sessionStorage.clear()
        window.location.reload()
    }
}

export default Login