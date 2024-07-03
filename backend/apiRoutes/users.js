const express = require('express');
const userRouter = express.Router();

module.exports = (pool, ensureAuthenticated) => {
    
        userRouter.get('/', ensureAuthenticated, async (req, res) => {
    
            await pool.query('SELECT * FROM users', (err, result) => {
                if (err) {
                    console.error("Error getting user:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(200).json(result.rows);
                }
            });
        });
        
        userRouter.get('/:id', ensureAuthenticated, async (req, res) => {
            const userId = parseInt(req.params.id);
            await pool.query('SELECT * FROM users WHERE id = $1', [userId], (err, result) => {
                if (err) {
                    console.error("Error getting user:", err);
                    res.status(500).json({ message: err.message });
                } else if (!result.rows[0]) {
                    res.status(404).json({ message: "User not found" });
                } else {
                    res.status(200).json(result.rows);
                }
            });
        });

        userRouter.put('/:id', ensureAuthenticated, async (req, res) => {
            const userId = parseInt(req.params.id);
            const { username, email, password, address } = req.body;
            await pool.query('UPDATE users SET username = $1, email = $2, password = $3, address = $4 WHERE id = $5', [username, email, password, address, userId], (err, result) => {
                if (err) {
                    console.error("Error updating user:", err);
                    res.status(500).json({ message: err.message });
                } else {
                    res.status(200).json({ message: "User updated" });
                }
            });
        });
    
        return userRouter;
}