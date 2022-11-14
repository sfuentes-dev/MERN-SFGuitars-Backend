import express from 'express'
import Order from '../models/Order.js'
import User from '../models/User.js'

const router = express.Router()

//Creando la Orden de compra

router.post('/', async (req, res) => {
  const io = req.app.get('socketio')
  const { userId, cart, country, address } = req.body
  try {
    const user = await User.findById(userId)
    const order = await Order.create({
      owner: user._id,
      products: cart,
      country,
      address,
    })
    order.count = cart.count
    order.total = cart.total
    await order.save()
    user.cart = { total: 0, count: 0 }
    user.orders.push(order)
    const notification = {
      status: 'unread',
      message: `New order from ${user.name}`,
      time: new Date(),
    }
    io.sockets.emit('new-order', notification)
    user.markModified('orders')
    await user.save()
    res.status(200).json(user)
  } catch (e) {
    res.status(400).json(e.message)
  }
})

// Trayendo a la vista de usuario las ordenes
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('owner', ['email', 'name'])
    res.status(200).json(orders)
  } catch (e) {
    res.status(400).json(e.message)
  }
})

//Haciendo el "envio" de la orden al usuario

router.patch('/:id/mark-shipped', async (req, res) => {
  const io = req.app.get('socketio')
  const { ownerId } = req.body
  const { id } = req.params
  try {
    const user = await User.findById(ownerId)
    await Order.findByIdAndUpdate(id, { status: 'shipped' })
    const orders = await Order.find().populate('owner', ['email', 'name'])
    const notification = {
      status: 'unread',
      message: `Order ${id} shipped with success`,
      time: new Date(),
    }
    io.sockets.emit('notification', notification, ownerId)
    user.notifications.unshift(notification)
    await user.save()
    res.status(200).json(orders)
  } catch (e) {
    res.status(400).json(e.message)
  }
})

export default router
