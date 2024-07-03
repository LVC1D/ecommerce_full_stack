const expres = require('express');
const cartRouter = expres.Router();

module.exports = (pool, ensureAuthenticated) => {
    
        cartRouter.get('/:id', ensureAuthenticated, async (req, res) => {
            const cartId = parseInt(req.params.id);
            const userId = parseInt(req.query.userId);
            await pool.query('SELECT * FROM cart WHERE id = $1 AND user_id = $2', [cartId, userId], (err, result) => {
                if (err) {
                    console.error("Error getting cart:", err);
                    res.status(500).json({ message: err.message });
                } else if (!result.rows[0]) {
                    res.status(404).json({ message: "Cart not found" });
                } else {
                    res.status(200).json(result.rows);
                }
            });
        });

        cartRouter.post('/', ensureAuthenticated, async (req, res) => {
            const { product_id, quantity } = req.body;
            await pool.query('INSERT INTO cart (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', [user_id, product_id, quantity], (err, result) => {
                if (err) {
                    console.error("Error adding to cart:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(201).json(result.rows[0]);
                }
            });
        });
    
        return cartRouter;
}