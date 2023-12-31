import { Request, Response } from 'express'

import { MEDIAS_MESSAGES } from '~/constants/messages'
import mediaService from '~/services/medias.services'

export const uploadImageController = async (req: Request, res: Response) => {
    const data = await mediaService.uploadImage({ req, maxFiles: 10 })

    return res.json({
        message: MEDIAS_MESSAGES.UPLOAD_IMAGE_SUCCESS,
        result: data
    })
}

export const uploadVideoController = async (req: Request, res: Response) => {
    const data = await mediaService.uploadVideo({ req, maxFiles: 2 })

    return res.json({
        message: MEDIAS_MESSAGES.UPLOAD_VIDEO_SUCCESS,
        result: data
    })
}
