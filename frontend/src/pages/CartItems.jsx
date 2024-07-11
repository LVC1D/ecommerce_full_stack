import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addByOne, removeByOne, setQuantity, fetchCartItems, updateCart, removeFromCart, makePayment } from "../features/cartItemSlice";

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
        setLocalCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product_id === productId ? { ...item, quantity } : item
            )
        );
    };

    const handlePayment = () => {
        dispatch(makePayment(cart.id));
    };

    const handleUpdate = () => {
        dispatch(updateCart({
            cartId: cart.id,
            items: localCartItems
        }));
    };

    const handleRemove = (cartId, productId) => {
        dispatch(removeFromCart({
            cartId,
            productId
        })).then(() => {
            console.log('Item removed:', productId);
            dispatch(fetchCartItems(cartId)).then((action) => {
                if (action.payload) {
                    setLocalCartItems(action.payload);
                }
            });
        });
    }

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
                {cartItems && cartItems.length > 0 ? cartItems.map((item) => (
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
            <button onClick={handleUpdate}>
                Update cart
            </button>
            <button onClick={handlePayment}>
                Proceed to checkout
            </button>
        </div>
    )
}