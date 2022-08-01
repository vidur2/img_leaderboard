import { NextApiRequest, NextApiResponse } from "next";
import { LoginInformation } from "../../types/loginTypes";
import { createHash } from "crypto"
import prisma from "../../prisma/prisma";

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

const loginHandler = (req: NextApiRequest, res: NextApiResponse) => {
    const body: LoginInformation = JSON.parse(req.body);

    checkDb(body).then((valid) => {
        if (valid) {
            res.status(200).json({ valid: valid })
        } else {
            res.status(400).json({ valid: valid })
        }
    })
}

export default loginHandler