import express from 'express'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

const router = express.Router()

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
})

router.delete('/:public_id', async (req, res) => {
  const { public_id } = req.params
  try {
    await cloudinary.uploader.destroy(public_id)
    res.status(200).send()
  } catch (e) {
    res.status(400).send(e.message)
  }
})

export default router
