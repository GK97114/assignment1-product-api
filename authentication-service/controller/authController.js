import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt";

// Simulated user data (in a real application, this would come from a database)
const user = {
    id: 1,
    username: process.env.AUTH_USERNAME,
    passwordHash: bcrypt.hashSync(process.env.AUTH_PASSWORD, 10),
};

// Login controller
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate request body
        if (!username || !password) {
            return res.status(400).json({ error: "Username and password are required" });
        }

        // Check if the username matches
        if (username !== user.username) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Check if the password matches
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid username or password" });
        }

        // Create JWT payload
        const payload = {
            userId: user.id,
            username: user.username,
        }

        // Sign token
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Return token
        return res.status(200).json({
            message: "Login successful",
            token,
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = {
    login,
};