import express from 'express';
import router from express.Router();

const authController = require('../controller/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Authentication route
router.post('/login', authController.login);

// Check wether provided token is valid
router.post("/verify", authenticateToken, (req, res) => {
    return res.status(200).json({
        valid: true,
        message: "Token is valid",
        user: req.user,
    });
});

module.exports = router;