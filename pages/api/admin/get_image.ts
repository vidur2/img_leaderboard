import { Images } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { checkDbAdmin } from "../../../../util/checkDb";
import prisma from "../../../prisma/prisma";
import { ImageInfo } from "../../../types/adminTypes";
import { LoginInformation } from "../../../types/loginTypes";

async function getImageAdmin(information: LoginInformation): Promise<ImageInfo> {
    const valid = await checkDbAdmin(information);

    if (valid) {
        const image = await fetchImage();
        return {
            image,
            validLogin: true
        }
    } else {
        return {
            image: null,
            validLogin: false
        }
    }
}

async function fetchImage(): Promise<Images | null> {
    let image = await prisma.images.findFirst({
        where: {
            state: "UnderReview"
        }
    })

    if (image != null) {
        await prisma.images.update({
            where: {
                id: image.id
            },

            data: {
                state: "ReviewStarted"
            }
        })
    } else {
        await prisma.images.updateMany({
            where: {
                state: "ReviewStarted"
            },
            data: {
                state: "UnderReview"
            }
        })

        image = await prisma.images.findFirst({
            where: {
                state: "UnderReview"
            }
        })
    }

    return image;
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const loginInfor: LoginInformation = JSON.parse(req.body);
    getImageAdmin(loginInfor).then((img) => {
        if (img.validLogin) {
            res.status(200).json({ image: img.image })
        } else {
            res.status(400).json({ image: null })
        }
    })
}

export default handler;