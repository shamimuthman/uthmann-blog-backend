const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

const router = express.Router();

//
// CLOUDINARY CONFIG
//

cloudinary.config({
  cloud_name:
    process.env.CLOUDINARY_CLOUD_NAME,

  api_key:
    process.env.CLOUDINARY_API_KEY,

  api_secret:
    process.env.CLOUDINARY_API_SECRET
});

//
// MEMORY STORAGE
//

const storage =
  multer.memoryStorage();

//
// ALLOWED IMAGE TYPES
//

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif"
];

//
// MULTER CONFIG
//

const upload = multer({

  storage,

  fileFilter: (
    req,
    file,
    cb
  ) => {

    if (
      allowedTypes.includes(
        file.mimetype
      )
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only JPG, PNG, WEBP and GIF images are allowed"
        ),
        false
      );
    }
  },

  limits: {
    fileSize:
      5 * 1024 * 1024
  }
});

//
// UPLOAD ROUTE
//

router.post(
  "/",

  upload.single("image"),

  async (req, res) => {

    try {

      //
      // NO FILE
      //

      if (!req.file) {

        return res
          .status(400)
          .json({
            message:
              "No image uploaded"
          });
      }

      //
      // CLOUDINARY UPLOAD
      //

      const result =
        await new Promise(
          (
            resolve,
            reject
          ) => {

            const stream =
              cloudinary.uploader.upload_stream(

                {
                  folder: "blog",
                  resource_type: "image"
                },

                (
                  error,
                  result
                ) => {

                  if (error) {
                    reject(error);
                  }

                  else {
                    resolve(result);
                  }
                }
              );

            streamifier
              .createReadStream(
                req.file.buffer
              )
              .pipe(stream);
          }
        );

      //
      // SUCCESS
      //

      res.json({

        success: true,

        imageUrl:
          result.secure_url
      });

    } catch (error) {

      console.error(error);

      //
      // FILE TOO LARGE
      //

      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {

        return res
          .status(400)
          .json({
            message:
              "Image size must be under 5MB"
          });
      }

      //
      // OTHER ERRORS
      //

      res.status(500).json({

        message:
          error.message ||
          "Upload failed"
      });
    }
  }
);

module.exports = router;