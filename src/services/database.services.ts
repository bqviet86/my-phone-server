import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'

import User from '~/models/schemas/User.schema'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import Address from '~/models/schemas/Address.schema'
import Brand from '~/models/schemas/Brand.schema'
import PhoneOption from '~/models/schemas/PhoneOption.schema'
import Phone from '~/models/schemas/Phone.schema'
import Cart from '~/models/schemas/Cart.schema'

config()

const uri = process.env.MONGO_DB_URI as string

class DatabaseService {
    private client: MongoClient
    private db: Db

    constructor() {
        this.client = new MongoClient(uri)
        this.db = this.client.db(process.env.MONGO_DB_NAME)
    }

    async connect() {
        try {
            await this.db.command({ ping: 1 })
            console.log('Pinged your deployment. You successfully connected to MongoDB!')
        } catch (error) {
            console.log(error)
        }
    }

    async indexUser() {
        const exists = await this.users.indexExists(['email_1'])

        if (!exists) {
            this.users.createIndex({ email: 1 }, { unique: true })
        }
    }

    get users(): Collection<User> {
        return this.db.collection(process.env.DB_USERS_COLLECTION as string)
    }

    get refreshTokens(): Collection<RefreshToken> {
        return this.db.collection(process.env.DB_REFRESH_TOKENS_COLLECTION as string)
    }

    get addresses(): Collection<Address> {
        return this.db.collection(process.env.DB_ADDRESSES_COLLECTION as string)
    }

    get brands(): Collection<Brand> {
        return this.db.collection(process.env.DB_BRANDS_COLLECTION as string)
    }

    get phoneOptions(): Collection<PhoneOption> {
        return this.db.collection(process.env.DB_PHONE_OPTIONS_COLLECTION as string)
    }

    get phones(): Collection<Phone> {
        return this.db.collection(process.env.DB_PHONES_COLLECTION as string)
    }

    get carts(): Collection<Cart> {
        return this.db.collection(process.env.DB_CARTS_COLLECTION as string)
    }
}

const databaseService = new DatabaseService()

export default databaseService
