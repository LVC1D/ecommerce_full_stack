const express = require('express');
const productRouter = express.Router();

module.exports = (pool)  => {
    productRouter.get('/', (req, res) => {
        pool.query('SELECT * FROM products', (err, result) => {
            if (err) {
                console.error("Error getting products:", err);
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(result.rows);
            }
        });
    });
    
    productRouter.get('/:id', (req, res) => {
        const productId = parseInt(req.params.id);
        pool.query('SELECT * FROM products WHERE id = $1', [productId], (err, result) => {
            if (err) {
                console.error("Error getting product:", err);
                res.status(500).json({ message: err.message });
            } else if (!result.rows[0]) {
                res.status(404).json({ message: "Product not found" });
            } else {
                res.status(200).json(result.rows[0]);
            }
        });
    });

    return productRouter;
}