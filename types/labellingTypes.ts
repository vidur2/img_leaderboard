import { Images } from "@prisma/client"

type Rectangle = {
    x1: number,
    x2: number,
    y1: number,
    y2: number
}

type LeaderBoardPosition = {
    rank: number,
    username: string,
    count: number
}

type ImageRes = {
    image: Images | undefined,
    valid: boolean
}

type ImagePost = {
    rectangles: string[],
    id: number,
    username: string
}

export type {
    Rectangle,
    ImageRes,
    ImagePost,
    LeaderBoardPosition
}