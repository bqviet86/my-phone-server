import express from 'express'
import { config } from 'dotenv'
import cors from 'cors'

import { UPLOAD_IMAGE_TEMP_DIR, UPLOAD_VIDEO_TEMP_DIR } from './constants/dir'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRouter from '~/routes/users.routes'
import mediasRouter from './routes/medias.routes'
import brandsRouter from './routes/brands.routes'
import phonesRouter from './routes/phones.routes'
import cartsRouter from './routes/carts.routes'
import ordersRouter from './routes/orders.routes'
import invoicesRouter from './routes/invoices.routes'
import searchRouter from './routes/search.routes'
import staticRouter from './routes/static.routes'
import databaseService from '~/services/database.services'
import { initFolder } from './utils/file'

config()

const port = process.env.PORT || 4000
const app = express()

// Init folders
initFolder(UPLOAD_IMAGE_TEMP_DIR)
initFolder(UPLOAD_VIDEO_TEMP_DIR)

// Connect to database and index fields
databaseService.connect().then(() => {
    databaseService.indexUser()
    databaseService.indexPhones()
})

// Middlewares
app.use(express.json())
app.use(
    cors({
        origin: ['http://localhost:3000'],
        credentials: true
    })
)

// Routes
app.use('/users', usersRouter)
app.use('/medias', mediasRouter)
app.use('/brands', brandsRouter)
app.use('/phones', phonesRouter)
app.use('/carts', cartsRouter)
app.use('/orders', ordersRouter)
app.use('/invoices', invoicesRouter)
app.use('/search', searchRouter)
app.use('/static', staticRouter)

// Error handler
app.use(defaultErrorHandler)

app.listen(port, () => console.log(`Listen on http://localhost:${port}`))
