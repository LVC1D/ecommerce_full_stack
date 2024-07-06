const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).json({ message: "Unauthorized" });
};

async function calculateSubtotal(cartId, pool) {
  let currentSubTotal = 0;
  let cartItemsResult = await pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cartId]);

  for (const item of cartItemsResult.rows) {
    let subCost = item.quantity * item.product_price;
    // console.log(subCost);
    currentSubTotal += subCost;
    // console.log(item);
  }

  return currentSubTotal;
};

async function incrementItemCount (cartId, pool) {
  let cartItemCount = await pool.query('SELECT COUNT(*) FROM cart_items WHERE cart_id = $1', [cartId]);
  // console.log(cartItemCount.rows[0]);
  return parseInt(cartItemCount.rows[0].count);
};

module.exports = { ensureAuthenticated, calculateSubtotal, incrementItemCount };