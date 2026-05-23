require('dotenv').config();

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');

const app = express();

app.use(cors({
  origin: [
    'https://uthman-blog.onrender.com',
    'http://localhost:4321'
  ]
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Backend Running' });
});

const PORT = process.env.PORT || 5000;

app.get('/debug-env', (req, res) => {
  res.json({
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    JWT_SECRET_EXISTS: !!process.env.JWT_SECRET
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});