const pool = require("../db/database");

/**
 * Gets all products from the database
 * 
 * GET /products route handler that queries the database for all products and returns them as a JSON array.
 * 
 * @param {import("express").Request} req is the request object used to access query parameters, body data, etc.
 * @param {import("express").Response} res is the response object used to send back the list of products or an error message
 */
const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products");
        console.log("Querying all products...");
        res.json({
            replicaId: res.locals.replicaId,
            products: result.rows
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

/**
 * Create a new product
 * 
 * POST /products route handler that accepts a JSON body with "name" and "price" fields, 
 * validates the input, inserts the new product into the database, and returns the created product with its ID.
 * 
 * @param {import("express").Request} req is the request object containing the product data in req.body
 * @param {import("express").Response} res is the response object used to send back the created product or an error message
 */
const createProduct = async (req, res) => {
    try {
        // console.log("createProduct hit", req.body);

        const { name, price } = req.body;

        // Validate and sanitize input
        if (!name || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({ error: "Product name is required and must be a non-empty string" });
        }
        if (price === undefined || typeof price !== "number" || price < 0) {
            return res.status(400).json({ error: "Product price is required and must be a non-negative number" });
        }

        // Prepare and execute the insert statement
        const result = await pool.query(
            "INSERT INTO products (name, price) VALUES ($1, $2) RETURNING id, name, price",
            [name, price]
        );

        // Return the new product as JSON
        res.status(201).json({
            replicaId: res.locals.replicaId,
            product: result.rows[0]
        });

    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};

module.exports = {
    getAllProducts,
    createProduct
};