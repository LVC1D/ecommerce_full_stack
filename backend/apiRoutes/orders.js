const express = require('express');
const orderRouter = express.Router();

module.exports = (pool, ensureAuthenticated) => {

    orderRouter.get('/', ensureAuthenticated, async (req, res) => {
        const userId = parseInt(req.query.userId);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid user ID" });
            return;
        }

        await pool.query('SELECT * FROM orders WHERE user_id = $1', [userId], (err, result) => {
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
        const userId = parseInt(req.query.userId);
        await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, userId], (err, result) => {
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

    return orderRouter;
}