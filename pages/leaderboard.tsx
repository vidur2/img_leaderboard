import Head from "next/head"
import { NextPage } from "next/types"
import { LeaderBoardPosition } from "../types/labellingTypes"
import styles from "../styles/Home.module.css"

const Leaderboard: NextPage<LeaderboardProps> = (leaderboard: LeaderboardProps) => {
    const sorted = leaderboard.leaderboard.sort();
    return (
        <div className={styles.container}>
            <Head>
                <title>leaderboard</title>
            </Head>
            <main className={styles.main}>
                <table>
                    {sorted.map((pos: LeaderBoardPosition, index: number) => {
                        return <tr key={index}><td>{index + 1}</td><td>{pos.username}</td><td>{pos.count}</td></tr>
                    })}
                </table>
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