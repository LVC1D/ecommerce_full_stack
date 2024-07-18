const express = require('express');
const productRouter = express.Router();
const {body, param, validationResult} = require('express-validator');

module.exports = (pool)  => {
    productRouter.get('/', async (req, res) => {
        await pool.query('SELECT * FROM products', (err, result) => {
            if (err) {
                console.error("Error getting products:", err);
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(result.rows);
            }
        });
    });
    
    productRouter.get('/:id', async (req, res) => {
        const productId = parseInt(req.params.id);
        await pool.query('SELECT * FROM products WHERE id = $1', [productId], (err, result) => {
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

    productRouter.get('/search/:term', [
        param('term').isString().isLength({ min: 3 }).trim().escape()
    ], async (req, res) => {
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array() });
        }
        
        const searchTerm = req.params.term;
        const sanitizedTerm = searchTerm.replace(/[^\w\s]/gi, ''); // Remove symbols from searchTerm
        const query = 'SELECT * FROM products WHERE name ILIKE $1 OR category ILIKE $2';
        const values = [`%${sanitizedTerm}%`, `%${sanitizedTerm}%`];

        await pool.query(query, values, (err, result) => {
            if (err) {
                console.error("Error getting products:", err);
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(result.rows);
            }
        });
    });

    return productRouter;
}