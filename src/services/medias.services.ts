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
        maxFileSize = 10 * 1024 * 1024 // 10mb
    }: {
        req: Request
        maxFiles: number
        maxFileSize?: number
    }) {
        const files = await handleUploadImage({ req, maxFiles, maxFileSize })
        const result: Media[] = []

        for (const file of files) {
            const newFilename = `${getNameFromFilename(file.newFilename)}.jpeg`
            const newFilepath = path.resolve(UPLOAD_IMAGE_DIR, newFilename)

            await sharp(file.filepath).jpeg({ quality: 100 }).toFile(newFilepath)
            sharp.cache(false)
            await fsPromise.unlink(file.filepath)

            result.push({
                url: `http://localhost:${process.env.PORT}/static/image/${newFilename}`,
                type: MediaTypes.Image
            })
        }

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
