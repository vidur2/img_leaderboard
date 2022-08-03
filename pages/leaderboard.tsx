import Head from "next/head"
import { NextPage } from "next/types"
import { LeaderBoardPosition } from "../types/labellingTypes"
import styles from "../styles/Home.module.css"
import { Table } from "antd"

const columns = [
    {
        title: "Rank",
        dataIndex: "rank",
        key: "rank"
    },
    {
        title: "Username",
        dataIndex: "username",
        key: "username"
    },

    {
        title: "Images Labelled",
        dataIndex: "count",
        key: "count"
    }
]

const Leaderboard: NextPage<LeaderboardProps> = (leaderboard: LeaderboardProps) => {
    const sorted = leaderboard.leaderboard.sort();
    return (
        <div className={styles.container}>
            <Head>
                <title>leaderboard</title>
            </Head>
            <main className={styles.main}>
                <Table dataSource={leaderboard.leaderboard} columns={columns}></Table>
            </main>
        </div>
    )
}

Leaderboard.getInitialProps = async({req}) => {
    const res = await fetch(`http://${req.headers.host}/api/rankingsApi`, {
        method: "GET"
    })

    const retVal: LeaderboardProps = await res.json()

    return retVal
}

type LeaderboardProps = {
    leaderboard: Array<LeaderBoardPosition>
}

export default Leaderboard