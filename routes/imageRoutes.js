import express from 'express'
import cloudinary from 'cloudinary'
import dotenv from 'dotenv'

const router = express.Router()

cloudinary.config({
  cloud_name: 'sfuentes-dev16',
  api_key: '954791121425873',
  api_secret: '7R7y6TdD1s_iHdYL6r-okurtt_M',
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
