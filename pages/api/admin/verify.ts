import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { LoginInformation } from "../../../types/loginTypes";
import { createHash } from "crypto"
import prisma from "../../../prisma/prisma";
import { Role } from "@prisma/client";
import nodemailer from "nodemailer"


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.emailUsername, // generated ethereal user
      pass: process.env.emailPassword, // generated ethereal password
    },
});

async function addUser(loginInformation: LoginInformation) {
    const hasher = createHash("sha256")
    const hashFinal = hasher.update(loginInformation.password).digest("hex");

    await prisma.user.create({
        data: {
            username: loginInformation.username,
            password: hashFinal,
            role: Role.Admin
        }
    })
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const jwtInformation = JSON.parse(req.body);

    try {
        const loginInformation: LoginInformation = jwt.verify(jwtInformation.jwt, process.env.jwtKey);
        addUser(loginInformation).then(() => {
            transporter.sendMail({
                from: "Image Labelling<vmod2005@gmail.com>",
                to: loginInformation.username,
                subject: "Email Verified",
                text: "Your email has been verified"
            })
            res.status(200).json({ valid: true, username: loginInformation.username, password: loginInformation.password })
        })
    } catch  {
        res.status(400).json({ valid: false })
    }
}

export default handler