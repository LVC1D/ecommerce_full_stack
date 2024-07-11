import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addByOne, removeByOne, setQuantity, fetchCartItems, updateCart, makePayment } from "../features/cartItemSlice";

export default function CartItems() {
    const dispatch = useDispatch();
    const {cart} = useSelector((state) => state.cart);
    const {cartItems} = useSelector((state) => state.cartItems);

    useEffect(() => {
        if (cart) {
            dispatch(fetchCartItems(cart?.id));
        }
    }, [dispatch, cart]);

    const handlePayment = () => {
        dispatch(makePayment(cart?.id));
    }

    return (
        <div>
            <h1>Cart Items</h1>
            <ul>
                {cartItems.map((item) => (
                    <li key={item.product_id}>
                        <p>Price: ${item.product_price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <button onClick={() => dispatch(addByOne({productId: item.product_id}))}>Add</button>
                        <button onClick={() => dispatch(removeByOne({productId: item.product_id}))}>Remove</button>
                        <input type='number' value={item.quantity} onChange={(e) => dispatch(setQuantity({productId: item.product_id, quantity: e.target.value}))}/>
                    </li>
                ))}
                <button onClick={handlePayment}>
                    Proceed to checkout
                </button>
            </ul>
        </div>
    )
}