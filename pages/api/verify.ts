import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { LoginInformation } from "../../types/loginTypes";
import { createHash } from "crypto"
import prisma from "../../prisma/prisma";
import { Role } from "@prisma/client";

async function addUser(loginInformation: LoginInformation) {
    const hasher = createHash("sha256")
    const hashFinal = hasher.update(loginInformation.password).digest("hex");

    await prisma.user.create({
        data: {
            username: loginInformation.username,
            password: hashFinal,
            role: Role.Labeller
        }
    })
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const jwtInformation = JSON.parse(req.body);

    try {
        const loginInformation: LoginInformation = jwt.verify(jwtInformation.jwt, process.env.jwtKey);
        addUser(loginInformation).then(() => {
            res.status(200).json({ valid: true, username: loginInformation.username, password: loginInformation.password })
        })
    } catch  {
        res.status(400).json({ valid: false })
    }
}

export default handler