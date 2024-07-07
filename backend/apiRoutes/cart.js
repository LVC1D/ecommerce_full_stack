const express = require('express');
const cartRouter = express.Router();

module.exports = (pool, ensureAuthenticated, calculateSubtotal, incrementItemCount) => {
    
        cartRouter.get('/', ensureAuthenticated, async (req, res) => {
            const userId = parseInt(req.query.userId, 10);

            if (isNaN(userId)) {
                return res.status(400).json({ message: "Invalid userId" });
            }
            
            await pool.query('SELECT * FROM cart WHERE user_id = $1', [userId], (err, result) => {
                if (err) {
                    console.error("Error getting cart:", err);
                    res.status(500).json({ message: err.message });
                } else if (!result.rows[0]) {
                    res.status(404).json({ message: "Cart not found" });
                } else {
                    res.status(200).json(result.rows[0]);
                }
            });
        });

        cartRouter.post('/', ensureAuthenticated, async (req, res) => {
            const userId = parseInt(req.query.userId, 10);

            if (isNaN(userId)) {
                return res.status(400).json({ message: "Invalid userId" });
            }

            const cartId = await pool.query('SELECT id FROM cart WHERE user_id = $1', [userId]);

            if (cartId.rows[0]) {
                res.status(400).json({ message: "Cart already exists" });
                return;
            }

            await pool.query('INSERT INTO cart (user_id) VALUES ($1) RETURNING *', [userId], (err, result) => {
                if (err) {
                    console.error("Error creating cart:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(201).json(result.rows[0]);
                }
            });
        });

        cartRouter.post('/:id', ensureAuthenticated, async (req, res) => {
            const cartId = req.params.id;
            const { productId } = req.body;
    
            if (!cartId) {
                res.status(400).json({ message: "Invalid cart ID" });
                return;
            }
    
            if (!productId) {
                res.status(400).json({ message: "Product ID is required" });
                return;
            }
    
            try {
                const productResult = await pool.query('SELECT * FROM products WHERE id = $1', [productId]);
                if (!productResult.rows[0]) {
                    res.status(404).json({ message: "Product not found" });
                    return;
                }
    
                const product = productResult.rows[0];
                const cartItemResult = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId, productId]);
    
                let subTotal;
    
                if (cartItemResult.rows[0]) {
                    const updatedCartItemResult = await pool.query('UPDATE cart_items SET quantity = quantity + 1 WHERE cart_id = $1 AND product_id = $2 RETURNING *', [cartId, productId]);
                    subTotal = await calculateSubtotal(cartId, pool);
                    res.status(200).json(updatedCartItemResult.rows[0]);
                } else {
                    const newCartItemResult = await pool.query('INSERT INTO cart_items (cart_id, product_id, product_price, quantity) VALUES ($1, $2, $3, $4) RETURNING *', [cartId, productId, product.price, 1]);
                    subTotal = await calculateSubtotal(cartId, pool);
                    res.status(201).json(newCartItemResult.rows[0]);
                }
                let count = await incrementItemCount(cartId, pool);
                await pool.query('UPDATE cart SET sub_total = $1, item_count = $2 WHERE id = $3', [subTotal, count, cartId]);
            } catch (err) {
                console.error("Error updating cart:", err);
                res.status(500).json({ message: err.message });
            }
        });

        // to create a checkout router
    
        return cartRouter;
}