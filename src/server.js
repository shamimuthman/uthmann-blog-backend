const uploadRoutes = require('./routes/upload');

console.log("SERVER STARTING...");
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

app.use('/api/upload', uploadRoutes);
app.use(cors({
  origin: [
    'https://uthman-blog.onrender.com',
    'https://uthmann-blog-backend-1.onrender.com',
    'http://localhost:4321'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend Running' });
});

console.log("Connecting to database...");

const PORT = process.env.PORT || 5000;
console.log(`Starting server on port ${PORT}...`);
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});