type LoginInformation = {
    username: string,
    password: string
}

type VerificationReq = {
    jwt: string
}

export type {
    LoginInformation,
    VerificationReq
}