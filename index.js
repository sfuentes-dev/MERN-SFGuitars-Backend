import express, { urlencoded, json } from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectDB from './config/db.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import imageRoutes from './routes/imageRoutes.js'
import Stripe from 'stripe'
import { Server } from 'socket.io'

import * as http from 'http'

const app = express()

dotenv.config()
connectDB()

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(json())
app.use('/users', userRoutes)
app.use('/products', productRoutes)
app.use('/orders', orderRoutes)
app.use('/images', imageRoutes)

const stripe = new Stripe(
  'sk_test_51LzMxFEBa3jZyODKYffCZFjYYTgzgQP83kMaqmjl5J0NYeZEqAojxbVzvqYQuKODSKHrf9e3FBRTztx9FPTt5i0C00W5XVZwqA'
)

app.post('/create-payment', async (req, res) => {
  const { amount } = req.body
  console.log(amount)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      payment_method_types: ['card'],
    })
    res.status(200).json(paymentIntent)
  } catch (e) {
    console.log(e.message)
    res.status(400).json(e.message)
  }
})

const PORT = process.env.PORT || 4000

// const server = http.createServer(app)

const server = http.createServer(app).listen(PORT, () => {
  console.log(`Server Running in Port ${PORT}`)
})

const io = new Server(server, {
  cors: 'http://127.0.0.1:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
})

app.set('socketio', io)
