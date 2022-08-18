import Head from "next/head"
import { NextRouter, useRouter } from "next/router"
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css"
import { LoginInformation } from "../types/loginTypes";
import { Button, Form, Input, PageHeader, Spin } from 'antd';
import { Header, Content } from "antd/lib/layout/layout";
import NavbarComponent from "../components/navbar";

const Login = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(values: LoginInformation) => {
        const username = values.username;
        const password = values.password;
        setLoading(true)
        await login(username, password, router, window);
        setLoading(false)
    }

    useEffect(() => {
        const username = window.sessionStorage.getItem("username");
        const password = window.sessionStorage.getItem("password");

        if (username != null && password != null){
            login(username, password, router, window)
        }
    })

    if (loading) {
        return (
            <div className={styles.conatiner}>
                <main className={styles.main}>
                    <Spin size="large"></Spin>
                </main>
            </div>
        )
    } else {
        return (
            <div className={styles.container}>
                <Head>
                    <title>Login</title>
                </Head>
                <Header><NavbarComponent /></Header>
                <main className={styles.main}>
                {/* <PageHeader className="site-page-header" title="User Login"></PageHeader> */}
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ remember: true }}
                    onFinish={handleSubmit}
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
        router.push("/")
    } else {
        window.sessionStorage.clear()
        window.location.reload()
    }
}

export default Login