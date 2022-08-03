import { NextApiResponse, NextApiRequest } from "next";
import { LoginInformation } from "../../../types/loginTypes";
import { checkDbAdmin } from "../../../../util/checkDb"

const handler = (req: NextApiRequest, res: NextApiResponse) => {
    const loginInfor: LoginInformation = JSON.parse(req.body);
    checkDbAdmin(loginInfor).then((valid) => {
        if (valid) {
            res.status(200).json({ valid })
        } else {
            res.status(400).json({ valid })
        }
    })
}

export default handler