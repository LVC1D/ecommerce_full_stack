import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchCartItems, updateCart, removeFromCart, makePayment, addByOne, removeByOne,setQuantity } from "../features/cartItemSlice";
import { fetchCartByIds } from "../features/cartSlice";

export default function CartItems() {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const { cartItems, subTotal, loading, error } = useSelector((state) => state.cartItems);
    const {user} = useSelector((state) => state.auth);

    useEffect(() => {
        if (cart) {
            dispatch(fetchCartItems(cart.id));
        }
    }, [dispatch, cart]);

    const handlePayment = () => {
        dispatch(makePayment(cart.id));
    };

    const handleUpdate = async () => {
        await dispatch(updateCart({
            cartId: cart.id,
            items: cartItems
        })).unwrap();
    };

    const handleRemove = async (productId) => {
        if (cart) {
            await dispatch(removeFromCart({ cartId: cart.id, productId })).unwrap();
            await dispatch(fetchCartByIds(user.id)).unwrap();
        }
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
                {cartItems.length > 0 ? cartItems.map((item) => (
                    <li key={item.product_id}>
                        <p>Price: ${item.product_price}</p>
                        <p>Quantity: {item.quantity}</p>
                        <button onClick={() => dispatch(addByOne({ productId: item.product_id }))}>+</button>
                        <button onClick={() => dispatch(removeByOne({ productId: item.product_id }))}>-</button>
                        <input type='number' value={item.quantity} onChange={(e) => dispatch(setQuantity({ productId: item.product_id, quantity: parseInt(e.target.value, 10) }))} />
                        <button onClick={() => handleRemove(item.product_id)}>
                            Remove
                        </button>
                    </li>
                )) : <p>Your cart is empty.</p>}
            </ul>
            <button onClick={handleUpdate}>
                Update cart
            </button>
            <p>Subtotal: ${subTotal}</p>
            <button onClick={handlePayment}>
                Proceed to checkout
            </button>
        </div>
    )
}