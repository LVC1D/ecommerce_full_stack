const express = require('express');
const orderRouter = express.Router();

module.exports = (pool, ensureAuthenticated) => {

    orderRouter.get('/', ensureAuthenticated, (req, res) => {
        pool.query('SELECT * FROM orders', (err, result) => {
            if (err) {
                console.error("Error getting orders:", err);
                res.status(500).json({ message: err.message });
            } else {
                res.status(200).json(result.rows);
            }
        });
    });
    
    orderRouter.get('/:id', ensureAuthenticated, async (req, res) => {
        const orderId = parseInt(req.params.id);
        await pool.query('SELECT * FROM orders WHERE id = $1', [orderId], (err, result) => {
            if (err) {
                console.error("Error getting order:", err);
                res.status(500).json({ message: err.message });
            } else if (!result.rows[0]) {
                res.status(404).json({ message: "Order not found" });
            } else {
                res.status(200).json(result.rows);
            }
        });
    });
    
    // todo the Post route

    return orderRouter;
}