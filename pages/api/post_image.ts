import { LabelState } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/prisma";
import { ImagePost } from "../../types/labellingTypes";

async function postImage(imageId: number, rectangles: string[], username: string) {
    await prisma.images.update({
        where: {
            id: imageId
        },
        data: {
            rectangles,
            state: LabelState.UnderReview,
            userUsername: username
        }
    })
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const body: ImagePost = JSON.parse(req.body);

    postImage(body.id, body.rectangles, body.username).then(() => {
        res.status(200).json({status: "updated"})
    })
}

export default handler