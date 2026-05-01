import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Mount authentication routes
app.use('/api/auth', authRoutes);

// Optional health check endpoint
app.get("/", (req, res) => {
    res.status(200).json({ message: "Authentication Service is running!" });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Authentication Service is running on port ${PORT}`);
});