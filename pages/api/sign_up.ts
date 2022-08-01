import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../prisma/prisma";
import { LoginInformation } from "../../types/loginTypes";
import nodemailer from "nodemailer"
import jwt from "jsonwebtoken"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.emailUsername, // generated ethereal user
      pass: process.env.emailPassword, // generated ethereal password
    },
});

async function checkValid(signUp: LoginInformation): Promise<boolean> {
    // Check if account already exists
    const user = await prisma.user.findUnique({
        where: {
            username: signUp.username
        }
    })
    
    return user == null;
}

async function sendEmail(username: string, password: string, host: string) {
    const jwt = signJwt(username, password);
    console.log(jwt)
    transporter.sendMail({
        from: '"Image Labelling" <vmod2005@gmail.com>',
        to: username,
        subject: "Image Labelling Authentication",
        html: `Click <a href=http://${host}/verify?${jwt}>here</a> to verify your account`
    })
} 

function signJwt(username: string, password: string): string {
    const token = jwt.sign({ username, password }, process.env.jwtKey);
    return token;
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const signUp: LoginInformation = JSON.parse(req.body);
    console.log(signUp)
    checkValid(signUp).then((valid) => {
        if (valid) {
            sendEmail(signUp.username, signUp.password, req.headers.host).then(() => {
                res.status(200).json({ valid })
            })
        } else {
            res.status(400).json({valid})
        }
    })
}

export default handler;