import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCartItems, updateCart, removeFromCart, makePayment } from "../features/cartItemSlice";
import { fetchCartByIds } from "../features/cartSlice";
import './CartItems.css';

export default function CartItems() {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const { loading, error } = useSelector((state) => state.cartItems);
    const { user } = useSelector((state) => state.auth);

    const [localCartItems, setLocalCartItems] = useState([]);

    useEffect(() => {
        if (cart) {
            dispatch(fetchCartItems(cart.id)).then((action) => {
                setLocalCartItems(action.payload);
            });
        }
    }, [dispatch, cart]);

    const handlePayment = () => {
        dispatch(makePayment(cart.id));
    };

    const handleUpdate = async () => {
        await dispatch(updateCart({
            cartId: cart.id,
            items: localCartItems
        })).unwrap();
        const updatedCartItems = await dispatch(fetchCartByIds(user.id)).unwrap();
        setLocalCartItems(updatedCartItems);
        console.log("Current Cart items: ", localCartItems);
    };

    const handleRemove = async (productId) => {
        if (cart) {
            await dispatch(removeFromCart({ cartId: cart.id, productId })).unwrap();
            const updatedCartItems = await dispatch(fetchCartByIds(user.id)).unwrap();
            setLocalCartItems(updatedCartItems);
        }
    };

    const handleQuantityChange = (product_id, quantity) => {
        setLocalCartItems((prevItems) =>
            prevItems.map((item) =>
                item.product_id === product_id ? { ...item, quantity: parseInt(quantity, 10) } : item
            )
        );
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="cart-container">
            <h1>Cart Items</h1>
            <ul className="cart-items-list">
                {localCartItems.length > 0 ? localCartItems.map((item) => (
                    <li key={item.product_id} className="cart-item">
                        <p>Price: ${item.product_price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <span onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}>+</span>
                        <span onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}>-</span>
                        <input type='number' value={item.quantity} onChange={(e) => handleQuantityChange(item.product_id, e.target.value)} />
                        <span onClick={() => handleRemove(item.product_id)}>
                            <img src="../src/assets/Trash_24.png" />
                        </span>
                    </li>
                )) : <p>Your cart is empty.</p>}
            </ul>
            <div className="cart-actions">
                <button onClick={handleUpdate}>
                    Update cart
                </button>
                <button onClick={handlePayment}>
                    Proceed to checkout
                </button>
            </div>
        </div>
    );
}