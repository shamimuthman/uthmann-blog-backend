const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

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
  "/",
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "No image uploaded"
        });
      }

      const result = await new Promise(
        (resolve, reject) => {
          const stream =
            cloudinary.uploader.upload_stream(
              {
                folder: "blog"
              },
              (error, result) => {
                if (error) reject(error);
                else resolve(result);
              }
            );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        }
      );

      res.json({
        success: true,
        imageUrl: result.secure_url
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Upload failed"
      });
    }
  }
);

module.exports = router;