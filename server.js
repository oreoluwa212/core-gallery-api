const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
    origin: 'http://localhost:5173', // Update this for production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Uncomment if you have a static uploads directory
// app.use('/uploads', express.static('uploads'));

app.use('/api/auth', require('./src/routes/authRoute'));
// app.use('/api/products', require('./src/routes/productRoutes'));

app.get('/', (req, res) => res.send('API is running'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
