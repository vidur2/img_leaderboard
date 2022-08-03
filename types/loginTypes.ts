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

export type {
    LoginInformation,
    VerificationReq,
    YtRequest
}