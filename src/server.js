console.log("SERVER STARTING...");

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const rateLimit =
  require("express-rate-limit");

const authRoutes =
  require("./routes/auth");

const postRoutes =
  require("./routes/posts");

const uploadRoutes =
  require("./routes/upload");

const app = express();

//
// TRUST PROXY
// IMPORTANT FOR RENDER
//

app.set(
  "trust proxy",
  1
);

//
// SECURITY HEADERS
//

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

//
// GLOBAL RATE LIMIT
//

const apiLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 100,

    message:
      "Too many requests. Try again later."
  });

app.use(apiLimiter);

//
// LOGIN RATE LIMIT
//

const loginLimiter =
  rateLimit({

    windowMs:
      15 * 60 * 1000,

    max: 10,

    message:
      "Too many login attempts. Try again later."
  });

//
// CORS
//

app.use(
  cors({

    origin: [
      "https://uthman-blog.onrender.com",
      "http://localhost:4321"
    ],

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE"
    ],

    credentials: true
  })
);

//
// BODY LIMITS
//

app.use(
  express.json({
    limit: "10mb"
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb"
  })
);

//
// HEALTH CHECK
//

app.get(
  "/",
  (req, res) => {

    res.json({
      success: true,
      message:
        "Backend Running"
    });
  }
);

//
// ROUTES
//

app.use(
  "/api/auth/login",
  loginLimiter
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/posts",
  postRoutes
);

app.use(
  "/api/upload",
  uploadRoutes
);

//
// 404
//

app.use(
  (
    req,
    res
  ) => {

    res.status(404).json({
      message:
        "Route not found"
    });
  }
);

//
// ERROR HANDLER
//

app.use(
  (
    err,
    req,
    res,
    next
  ) => {

    console.error(err);

    res.status(500).json({
      message:
        "Internal server error"
    });
  }
);

//
// START SERVER
//

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {

    console.log(
      `Server running on port ${PORT}`
    );
  }
);