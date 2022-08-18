import { Button, Form, Input } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import styles from "../styles/Home.module.css"
import { LoginInformation } from "../types/loginTypes";

const SignUp = () => {
    const router = useRouter();

    useEffect(() => {
        if (window.sessionStorage.getItem("username") != null && window.sessionStorage.getItem("password") != null) {
            router.push("/")
        }
    })

    const handleSignUp = async({username, password, confirmed}) => {

        if (password === confirmed) {
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
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={handleSignUp}
                autoComplete="off"
                >
                <Form.Item
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    label="Confirm"
                    name="confirmed"
                    rules={[{ required: true, message: 'Please confirm your password!' }]}
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
                </Form>
            </main>
        </div>
    )
}

export default SignUp;