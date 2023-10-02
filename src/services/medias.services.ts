import { Request } from 'express'
import { config } from 'dotenv'
import fsPromise from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

import { UPLOAD_IMAGE_DIR } from '~/constants/dir'
import { MediaTypes } from '~/constants/enums'
import { Media } from '~/models/Others'
import { getNameFromFilename, handleUploadImage, handleUploadVideo } from '~/utils/file'

config()

class MediaService {
    async uploadImage({
        req,
        maxFiles,
        maxFileSize = 1024 * 1024 // 1mb
    }: {
        req: Request
        maxFiles: number
        maxFileSize?: number
    }) {
        const files = await handleUploadImage({ req, maxFiles, maxFileSize })
        const result: Media[] = await Promise.all(
            files.map(async (file) => {
                const newFilename = `${getNameFromFilename(file.newFilename)}.jpeg`
                const newFilepath = path.resolve(UPLOAD_IMAGE_DIR, newFilename)

                // quality: 80%
                await sharp(file.filepath).jpeg().toFile(newFilepath)
                await fsPromise.unlink(file.filepath)

                return {
                    url: `http://localhost:${process.env.PORT}/static/image/${newFilename}`,
                    type: MediaTypes.Image
                }
            })
        )

        return result
    }

    async uploadVideo({
        req,
        maxFiles,
        maxFileSize = 50 * 1024 * 1024 // 50mb
    }: {
        req: Request
        maxFiles: number
        maxFileSize?: number
    }) {
        const files = await handleUploadVideo({ req, maxFiles, maxFileSize })
        const result: Media[] = files.map((file) => {
            return {
                url: `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
                type: MediaTypes.Video
            }
        })

        return result
    }
}

const mediaService = new MediaService()

export default mediaService
