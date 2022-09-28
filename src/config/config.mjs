import * as dotenv from 'dotenv'

dotenv.config({ path: '../.env.local' })

export default {
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  databaseName: process.env.DB_NAME,
  secretKey: process.env.SECRET_KEY,
}
