import jwt from "jsonwebtoken";

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        // Check if header exists and starts with "Bearer "
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Authorization header missing or malformed" });
        }

        // Extract token from header
        const token = authHeader.split(" ")[1];
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info to request object
        req.user = decoded;

        // Call next middleware
        next();

    } catch (error) {
        return res.status(403).json({ error: "Invalid or expired token" });
    }
};

module.exports = {
    authenticateToken
};