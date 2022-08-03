import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/prisma";
import { LeaderBoardPosition } from "../../types/labellingTypes";

const prismaTyped: PrismaClient = prisma;

async function fetchRankings(): Promise<Array<LeaderBoardPosition>> {
    const top10 = prismaTyped.user.findMany({
        orderBy: {
            imgCount: "desc"
        },
        take: 10
    })

    const retArr: Array<LeaderBoardPosition> = new Array();

    (await top10).forEach((user) => {
        const rank: LeaderBoardPosition = {
            username: user.username,
            count: user.imgCount
        }
        retArr.push(rank)
    })

    return retArr
}

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
    fetchRankings().then((leaderboard) => {
        res.status(200).json({ leaderboard })
    })
}

export default handler