import { Request, Response } from 'express'
import path from 'path'

import { UPLOAD_IMAGE_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { MEDIAS_MESSAGES } from '~/constants/messages'

export const serveImageController = (req: Request, res: Response) => {
    const { name } = req.params

    return res.sendFile(path.resolve(UPLOAD_IMAGE_DIR, name), (err) => {
        if (err) {
            return res.status((err as any).status).send({
                message: MEDIAS_MESSAGES.IMAGE_NOT_FOUND
            })
        }
    })
}

export const serveVideoController = (req: Request, res: Response) => {
    const { name } = req.params

    return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
        if (err) {
            return res.status((err as any).status).send({
                message: MEDIAS_MESSAGES.VIDEO_NOT_FOUND
            })
        }
    })
}
