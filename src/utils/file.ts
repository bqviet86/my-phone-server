import { Request } from 'express'
import fs from 'fs'
import path from 'path'
import formidable, { File } from 'formidable'

import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { MEDIAS_MESSAGES } from '~/constants/messages'

export const initFolder = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, {
            recursive: true
        })
    }
}

export const getNameFromFilename = (filename: string) => {
    const ext = path.extname(filename)

    return filename.replace(ext, '')
}

export const getExtensionFromFilename = (filename: string) => {
    const ext = path.extname(filename)

    return ext.slice(1)
}

export const handleUploadImage = ({
    req,
    maxFiles,
    maxFileSize
}: {
    req: Request
    maxFiles: number
    maxFileSize: number
}) => {
    const form = formidable({
        uploadDir: UPLOAD_IMAGE_TEMP_DIR,
        keepExtensions: true,
        maxFiles,
        maxFileSize,
        maxTotalFileSize: maxFiles * maxFileSize,
        filter: ({ name, originalFilename, mimetype }) => {
            const valid = name === 'image' && Boolean(mimetype?.includes('image'))

            if (!valid) {
                form.emit('error' as any, new Error(MEDIAS_MESSAGES.INVALID_FILE_TYPE) as any)
            }

            return valid
        }
    })

    return new Promise<File[]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err)
            }

            if (!files.image) {
                return reject(new Error(MEDIAS_MESSAGES.NO_IMAGE_PROVIDED))
            }

            resolve(files.image)
        })
    })
}

export const handleUploadVideo = async ({
    req,
    maxFiles,
    maxFileSize
}: {
    req: Request
    maxFiles: number
    maxFileSize: number
}) => {
    const form = formidable({
        uploadDir: UPLOAD_VIDEO_DIR,
        keepExtensions: true,
        maxFiles,
        maxFileSize,
        maxTotalFileSize: maxFiles * maxFileSize,
        filter: ({ name, originalFilename, mimetype }) => {
            const valid = name === 'video' && Boolean(mimetype?.includes('mp4') || mimetype?.includes('quicktime'))

            if (!valid) {
                form.emit('error' as any, new Error(MEDIAS_MESSAGES.INVALID_FILE_TYPE) as any)
            }

            return valid
        }
    })

    return new Promise<File[]>((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if (err) {
                return reject(err)
            }

            if (!files.video) {
                return reject(new Error(MEDIAS_MESSAGES.NO_VIDEO_PROVIDED))
            }

            resolve(files.video)
        })
    })
}
