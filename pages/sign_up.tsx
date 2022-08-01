import Head from "next/head";
import styles from "../styles/Home.module.css"
import { LoginInformation } from "../types/loginTypes";

const SignUp = () => {

    const handleSignUp = async(event) => {
        event.preventDefault()
        const username = event.target.username.value;
        const password = event.target.password.value;
        const confirmed = event.target.confirm.value;
        console.log("shit")
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
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Sign Up</title>
            </Head>
            <main className={styles.main}>
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