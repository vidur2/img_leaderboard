import { LabelState, PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next"
import prisma from "../../../prisma/prisma";
import { ImageJudge, Judgement } from "../../../types/adminTypes";

const prismaTyped = prisma as PrismaClient

async function handleImage(imgInfo: ImageJudge) {
    switch (imgInfo.judgement){
        case Judgement.Good:
            const img = await prismaTyped.images.update({
                where: {
                    id: imgInfo.id
                },
                data: {
                    state: LabelState.Done,
                }
            })

            await prismaTyped.user.update({
                where: {
                    username: img.userUsername
                },
                data: {
                    imgCount: { increment: 1 }
                }
            })
            break
        case Judgement.Bad:
            await prismaTyped.images.update({
                where: {
                    id: imgInfo.id
                },
                data: {
                    state: LabelState.NotStarted,
                    userUsername: null
                }
            })
    }
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const imgInfo: ImageJudge = JSON.parse(req.body);

    handleImage(imgInfo).then(() => {
        res.status(200).json({status: true})
    })
}

export default handler;