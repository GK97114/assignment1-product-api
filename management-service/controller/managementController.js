const pool = require("../db/database");

/**
 * Create a new product
 * 
 * POST /api/products route handler that accepts a JSON body with "name" and "price" fields, 
 * validates the input, inserts the new product into the database, and returns the created product with its ID.
 * 
 * @param {import("express").Request} req is the request object containing the product data in req.body
 * @param {import("express").Response} res is the response object used to send back the created product or an error message
 */
const createProduct = async (req, res) => {
    try {
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
            service: "management",
            replicaId: res.locals.replicaId,
            product: result.rows[0]
        });

    } catch (error) {
        console.error("[Management Service] Error creating product:", error);
        res.status(500).json({ error: "Failed to create product" });
    }
};

/**
 * Update an existing product
 * 
 * PUT /api/products/:id route handler that accepts product ID and updated data,
 * validates the input, updates the product in the database, and returns the updated product.
 * 
 * @param {import("express").Request} req is the request object containing the product ID and updated data
 * @param {import("express").Response} res is the response object used to send back the updated product or an error message
 */
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price } = req.body;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "Product ID must be a valid number" });
        }

        // Validate input
        if (name && (typeof name !== "string" || name.trim() === "")) {
            return res.status(400).json({ error: "Product name must be a non-empty string" });
        }
        if (price !== undefined && (typeof price !== "number" || price < 0)) {
            return res.status(400).json({ error: "Product price must be a non-negative number" });
        }

        // Check if product exists
        const checkResult = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Build dynamic update query
        const updates = [];
        const values = [];
        let paramCount = 1;

        if (name !== undefined) {
            updates.push(`name = $${paramCount++}`);
            values.push(name);
        }
        if (price !== undefined) {
            updates.push(`price = $${paramCount++}`);
            values.push(price);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "At least one field (name or price) must be provided for update" });
        }

        values.push(id);
        const query = `UPDATE products SET ${updates.join(", ")} WHERE id = $${paramCount} RETURNING id, name, price`;

        const result = await pool.query(query, values);

        res.json({
            service: "management",
            replicaId: res.locals.replicaId,
            product: result.rows[0]
        });

    } catch (error) {
        console.error("[Management Service] Error updating product:", error);
        res.status(500).json({ error: "Failed to update product" });
    }
};

/**
 * Delete a product
 * 
 * DELETE /api/products/:id route handler that deletes a product from the database by ID.
 * 
 * @param {import("express").Request} req is the request object containing the product ID
 * @param {import("express").Response} res is the response object used to send back confirmation or an error message
 */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(id)) {
            return res.status(400).json({ error: "Product ID must be a valid number" });
        }

        // Check if product exists
        const checkResult = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
        if (checkResult.rows.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Delete the product
        await pool.query("DELETE FROM products WHERE id = $1", [id]);

        res.json({
            service: "management",
            replicaId: res.locals.replicaId,
            message: `Product with ID ${id} has been deleted successfully`
        });

    } catch (error) {
        console.error("[Management Service] Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct
};
