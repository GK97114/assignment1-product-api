const { Pool } = require("pg");

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Test Connection on startup
pool.connect()
    .then(client => {
        console.log("Connected to PostgreSQL database");
        client.release();
    })
    .catch(err => {
        console.error("Error connecting to PostgreSQL database:", err);
    });

module.exports = pool;