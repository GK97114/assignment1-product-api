const pool = require("../db/database");

/**
 * Gets all products from the database
 * 
 * GET /api/catalog route handler that queries the database for all products and returns them as a JSON array.
 * 
 * @param {import("express").Request} req is the request object used to access query parameters, body data, etc.
 * @param {import("express").Response} res is the response object used to send back the list of products or an error message
 */
const getAllProducts = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM products");
        console.log("[Catalog Service] Querying all products...");
        res.json({
            service: "catalog",
            replicaId: res.locals.replicaId,
            products: result.rows
        });
    } catch (error) {
        console.error("[Catalog Service] Error fetching products:", error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
};

/**
 * Gets a single product by ID
 * 
 * GET /api/catalog/:id route handler that queries the database for a specific product by ID.
 * 
 * @param {import("express").Request} req is the request object containing the product ID in req.params
 * @param {import("express").Response} res is the response object used to send back the product or an error message
 */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "Product ID must be a valid number" });
        }

        const result = await pool.query("SELECT * FROM products WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        res.json({
            service: "catalog",
            replicaId: res.locals.replicaId,
            product: result.rows[0]
        });
    } catch (error) {
        console.error("[Catalog Service] Error fetching product:", error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
};

module.exports = {
    getAllProducts,
    getProductById
};
