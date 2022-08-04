import { Images, Role } from "@prisma/client"

type LoginInformation = {
    username: string,
    password: string
}

type VerificationReq = {
    jwt: string
}

type YtRequest = {
    login: LoginInformation,
    link: string
}

type UserInformation = {
    role: Role,
    images: Images[]
}

export type {
    LoginInformation,
    VerificationReq,
    YtRequest,
    UserInformation
}