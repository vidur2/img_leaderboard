import { Images } from "@prisma/client"

type ImageInfo = {
    image: Images | null,
    validLogin: boolean
}

export enum Judgement {
    Good,
    Bad
}

type ImageJudge = {
    judgement: Judgement,
    id: number
}

export type {
    ImageInfo,
    ImageJudge
}