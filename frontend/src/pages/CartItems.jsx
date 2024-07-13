import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addByOne, removeByOne, fetchCartItems, updateCart, removeFromCart, makePayment } from "../features/cartItemSlice";

export default function CartItems() {
    const dispatch = useDispatch();
    const {cart} = useSelector((state) => state.cart);
    const {cartItems, loading, error} = useSelector((state) => state.cartItems);
    const [localCartItems, setLocalCartItems] = useState([]);

    useEffect(() => {
        if (cart) {
            dispatch(fetchCartItems(cart.id)).then((action) => {
                if (action.payload) {
                    setLocalCartItems(action.payload);
                }
            });
        }
    }, [dispatch, cart]);

    const handleQuantityChange = (productId, quantity) => {
        setLocalCartItems((prevItems) => {
            return prevItems.map((item) => {
                return item.product_id === productId ? { ...item, quantity } : item;
            });
        });
    };

    const handlePayment = () => {
        dispatch(makePayment(cart.id));
    };

    const handleUpdate = (cartId, items) => {
        console.log('Updating cart:', cartId, items);
        dispatch(updateCart({ cartId, items })).then(() => {
            dispatch(fetchCartItems(cartId));
        });
    };

    const handleRemove = (cartId, productId) => {
        console.log('Removing item from cart:', productId);
        dispatch(removeFromCart({ cartId, productId })).then(() => {
            dispatch(fetchCartItems(cartId));
        });
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div>
            <h1>Cart Items</h1>
            <ul>
                {localCartItems ? localCartItems.map((item) => (
                    <li key={item.product_id}>
                        <p>Price: ${item.product_price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <button onClick={() => dispatch(addByOne({ productId: item.product_id }))}>+</button>
                        <button onClick={() => dispatch(removeByOne({ productId: item.product_id }))}>-</button>
                        <input 
                            type='number' 
                            value={item.quantity} 
                            onChange={(e) => handleQuantityChange(item.product_id, parseInt(e.target.value, 10))} />
                        <button onClick={() => handleRemove(cart.id, item.product_id)}>
                            Remove
                        </button>
                    </li>
                )) : <p>Your cart is empty.</p>}
            </ul>
            <button onClick={() => handleUpdate(cart.id, cartItems)}>
                Update cart
            </button>
            <button onClick={handlePayment}>
                Proceed to checkout
            </button>
        </div>
    )
}