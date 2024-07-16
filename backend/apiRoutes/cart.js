const express = require('express');
const cartRouter = express.Router();
const stripe = require('stripe')(process.env.STRIPE_CLIENT_SECRET);
require('dotenv').config();

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

        cartRouter.get('/:id/items', ensureAuthenticated, async (req, res) => {
            const cartId = req.params.id;

            if (!cartId) {
                res.status(400).json({ message: "Invalid cart ID" });
                return;
            }

            await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId], (err, result) => {
                if (err) {
                    console.error("Error getting cart items:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(200).json(result.rows);
                }
            });
        })

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
                    console.log("Cart created:", result.rows[0]);
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

        cartRouter.put('/:id', ensureAuthenticated, async (req, res) => {
            const cartId = req.params.id;
            const { items } = req.body;

            if (!cartId) {
                res.status(400).json({ message: "Invalid cart ID" });
                return;
            }
            if (!Array.isArray(items) || items.length === 0) {  
                res.status(400).json({ message: "Invalid items" });
                return;
            }

            try {
                await pool.query('BEGIN');
        
                for (const item of items) {
                    const {productId, quantity} = item;
                    console.log('Updating item:', productId, 'with quantity:', quantity);
                    if (isNaN(quantity) || quantity < 0) {
                        res.status(400).json({ message: "Invalid quantity" });
                        return;
                    }
        
                    await pool.query('UPDATE cart_items SET quantity = $1 WHERE cart_id = $2 AND product_id = $3', [quantity, cartId, product_id]);

                    // console.log(item);
                }
        
                const subTotal = await calculateSubtotal(cartId, pool);
                await pool.query('UPDATE cart SET sub_total = $1 WHERE id = $2', [subTotal, cartId]);
        
                await pool.query('COMMIT');
        
                // Fetch the updated cart items
                const updatedItemsResult = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
                console.log('Updated cart items:', updatedItemsResult.rows);
                res.status(200).json({
                    message: "Cart items updated",
                    cartItems: updatedItemsResult.rows,
                    subTotal: subTotal
                });
        
            } catch (err) {
                await pool.query('ROLLBACK');
                console.error("Error updating cart:", err);
                res.status(500).json({ message: err.message });
            }
        });

        cartRouter.delete('/:id', ensureAuthenticated, async (req, res) => {
            const cartId = req.params.id;

            if (!cartId) {
                res.status(400).json({ message: "Invalid cart ID" });
                return;
            }

            await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId], async (err) => {
                if (err) {
                    console.error("Error deleting cart items:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    await pool.query('DELETE FROM cart WHERE id = $1', [cartId], (err) => {
                        if (err) {
                            console.error("Error deleting cart:", err);
                            res.status(500).json({ message: err.message });
                        } else {
                            res.status(204).end();
                        }
                    });
                }
            });
        });

        cartRouter.delete('/:id/items/:productId', ensureAuthenticated, async (req, res) => {
            const cartId = req.params.id;
            const productId = req.params.productId;

            if (!cartId) {
                res.status(400).json({ message: "Invalid cart ID" });
                return;
            }

            if (!productId) {
                res.status(400).json({ message: "Invalid product ID" });
                return;
            }

            await pool.query('DELETE FROM cart_items WHERE cart_id = $1 AND product_id = $2', [cartId, productId], async (err) => {
                if (err) {
                    console.error("Error deleting cart item:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    let subTotal = await calculateSubtotal(cartId, pool);
                    let count = await incrementItemCount(cartId, pool);
                    await pool.query('UPDATE cart SET sub_total = $1, item_count = $2 WHERE id = $3', [subTotal, count, cartId]);
                    const updatedItemsResult = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
                    res.status(200).json({
                        message: "Cart item deleted",
                        cartItems: updatedItemsResult.rows,
                        subTotal: subTotal
                    });
                }
            });
        })

        cartRouter.post('/:id/create-checkout', ensureAuthenticated, async (req, res) => {
            const cartId = req.params.id;
            // handle the Stripe-enabled payment gateway
            const cartItemsResult = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);
            const lineItems = cartItemsResult.rows.map((item) => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.product_id.toString(),
                        },
                        unit_amount: Math.round(item.product_price * 100),
                    },
                    quantity: item.quantity,
                };
            });

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: "https://localhost:5173/success",
                cancel_url: "https://localhost:5173/cancel",
            });
            res.status(201).json({ id: session.id });
        })

        // to create a checkout router
        cartRouter.post('/:id/checkout', ensureAuthenticated, async (req, res) => {
            // declare the params and the request body
            const cartId = req.params.id;
            let {userId, orderSum} = req.body;

            if (!cartId) {
                res.status(400).json({ message: "Invalid cart ID" });
            return;
            }
            // assign the dynamic values to our request body
            try {
                await pool.query('BEGIN');
        
                let subTotalResult = await pool.query('SELECT sub_total FROM cart WHERE id = $1', [cartId]);
                let userResult = await pool.query('SELECT user_id FROM cart WHERE id = $1', [cartId]);
        
                if (!subTotalResult.rows[0] || !userResult.rows[0]) {
                    await pool.query('ROLLBACK');
                    res.status(404).json({ message: "Cart not found" });
                    return;
                }
        
                userId = userResult.rows[0].user_id;
                orderSum = subTotalResult.rows[0].sub_total;
        
                const orderResult = await pool.query('INSERT INTO orders (user_id, order_sum) VALUES ($1, $2) RETURNING *', [userId, orderSum]);
        
                await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
                await pool.query('DELETE FROM cart WHERE id = $1', [cartId]);
                // await pool.query('INSERT INTO cart (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING', [userId]);
        
                await pool.query('COMMIT');
        
                res.status(201).json(orderResult.rows[0]);
            } catch (err) {
                await pool.query('ROLLBACK');
                console.error("Error creating order:", err);
                res.status(500).json({ message: err.message });
            }
        });
    
        return cartRouter;
}