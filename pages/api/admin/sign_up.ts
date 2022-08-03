import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer"
import { LoginInformation } from "../../../types/loginTypes";
import jwt from "jsonwebtoken";
import prisma from "../../../prisma/prisma";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.emailUsername, // generated ethereal user
      pass: process.env.emailPassword, // generated ethereal password
    },
});

async function sendEmail(username: string, password: string, host: string) {
    const jwt = signJwt(username, password);
    console.log(jwt)
    transporter.sendMail({
        from: '"Image Labelling" <vmod2005@gmail.com>',
        to: "vmod2005@gmail.com",
        subject: "Image Labelling Authentication",
        html: `Click <a href=http://${host}/verify_admin?${jwt}>here</a> to verify ${username}'s account`
    })
} 

async function checkValid(signUp: LoginInformation): Promise<boolean> {

    try {
        const user = await prisma.user.findUnique({
            where: {
                username: signUp.username
            }
        })
        
        return user == null;
    } catch {
        return false
    }
}

function signJwt(username: string, password: string): string {
    const token = jwt.sign({ username, password }, process.env.jwtKey);
    return token;
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const signUpReq: LoginInformation = JSON.parse(req.body);

    checkValid(signUpReq).then((valid) => {
        if (valid) {
            sendEmail(signUpReq.username, signUpReq.password, req.headers.host).then(() => {
                res.status(200).json({ valid })
            })
        } else {
            res.status(400).json({ valid })
        }
    })
}

export default handler;