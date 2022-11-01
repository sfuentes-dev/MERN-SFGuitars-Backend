import express, { urlencoded, json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import imageRoutes from './routes/imageRoutes.js'

const app = express()

dotenv.config()
connectDB()

app.use(cors())
app.use(json())
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/images', imageRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log('Server Running in Port 4000')
})
