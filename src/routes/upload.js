const express = require("express");
const multer = require("multer");

const router = express.Router();

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

      // TEMP TEST RESPONSE
      // later you'll upload to github/cloudinary

      res.json({
        success: true,
        imageUrl:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
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