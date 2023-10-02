import { Router } from 'express'

import { serveImageController, serveVideoController } from '~/controllers/static.controllers'

const staticRouter = Router()

staticRouter.get('/image/:name', serveImageController)
staticRouter.get('/video/:name', serveVideoController)

export default staticRouter
