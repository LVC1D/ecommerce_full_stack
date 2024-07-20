import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCartItems, updateCart, removeFromCart, makePayment } from "../features/cartItemSlice";
import { fetchCartByIds } from "../features/cartSlice";
import './CartItems.css';
import trashImage from "../assets/Trash-32.png";
import plusIcon from '../assets/Plus_light.png';
import minusIcon from '../assets/Minus_24.png';
import CartModal from "../components/CartModal";
import PropTypes from 'prop-types';

export default function CartItems( {isVisible, onClose} ) {
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
        <CartModal onClose={onClose} isVisible={isVisible}>
            <div className="cart-container">
                <h1>Cart Items</h1>
                <ul className="cart-items-list">
                    {localCartItems.length > 0 ? localCartItems.map((item) => (
                        <li key={item.product_id} className="cart-item">
                            <div className="item-header">
                                <p>{item.name}: ${item.product_price} each</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Category: {item.category}</p>
                            </div>
                            
                            <div className="item-body">
                                <div className="item-counter">
                                    <span onClick={() => handleQuantityChange(item.product_id, item.quantity - 1)}><img src={minusIcon}/></span>
                                    <input type='number' value={item.quantity} onChange={(e) => handleQuantityChange(item.product_id, e.target.value)} />
                                    <span onClick={() => handleQuantityChange(item.product_id, item.quantity + 1)}><img src={plusIcon}/></span>
                                </div>
                                <span onClick={() => handleRemove(item.product_id)}>
                                    <img src={trashImage} />
                                </span>
                            </div>
                        </li>
                    )) : <p>Your cart is empty.</p>}
                </ul>
                <p>Subtotal: ${cart.sub_total}</p>
                <div className="cart-actions">
                    <button onClick={handleUpdate}>
                        Update cart
                    </button>
                    <button onClick={handlePayment}>
                        Proceed to checkout
                    </button>
                </div>
            </div>
        </CartModal>
    );
}

CartItems.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
};