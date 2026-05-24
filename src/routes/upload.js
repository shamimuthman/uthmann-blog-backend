const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();

const upload = multer({
  storage
});

router.post(
  '/',
  upload.single('image'),
  async (req, res) => {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({
          message: 'No image uploaded'
        });
      }

      const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;

      const result =
        await cloudinary.uploader.upload(base64, {
          folder: 'blog-images'
        });

      res.json({
        success: true,
        imageUrl: result.secure_url
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message: 'Upload failed'
      });
    }
  }
);

module.exports = router;