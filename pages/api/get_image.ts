import { LabelState } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/prisma";
import { LoginInformation } from "../../types/loginTypes"
import { createHash } from "crypto";

const hasher = createHash("sha256")

async function checkDb(loginInformation: LoginInformation): Promise<boolean> {
    const infor = await prisma.user.findUnique({
        where: {
            username: loginInformation.username
        }
    })

    const hash = hasher.update(loginInformation.password).digest("hex");

    if (infor != null) {
        return infor.password == hash
    } else {
        return false
    }
}

async function getLatestImage() {
    let unlabelledImage = await prisma.images.findFirst({
        where: {
            state: LabelState.NotStarted
        }
    })

    if (unlabelledImage == null) {
        unlabelledImage = await prisma.images.findFirst({
            where: {
                state: LabelState.InProgress
            }
        })

        await prisma.images.updateMany({
            where: {
                state: LabelState.InProgress
            },

            data: {
                state: LabelState.NotStarted
            }
        })
    }
    

    await prisma.images.update({
        where: {
            id: unlabelledImage.id
        },

        data: {
            state: LabelState.InProgress
        }
    })

    return unlabelledImage 
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const loginInformation: LoginInformation = JSON.parse(req.body);
    checkDb(loginInformation).then((valid) => {
        if (valid) {
            getLatestImage().then((image) => {
                if (image != null) {
                    res.status(200).json({ image, valid: valid })
                } else {
                    res.status(200).json({ image, valid: false })
                }
            })
        } else {
            res.status(400).json({ image: undefined, valid: valid })
        }
    })

}

export default handler