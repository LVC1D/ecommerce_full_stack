import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createOrder, fetchCartItems } from "../features/cartItemSlice";
import { createCart, fetchCartByIds } from "../features/cartSlice";
import ROUTES from "../routes";

export default function Success() {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [orderCreated, setOrderCreated] = useState(false);

    useEffect(() => {
        
        if (cart && user && !orderCreated) {
            dispatch(createOrder({
                cartId: cart?.id,
                userId: user?.id,
                orderSum: cart.sub_total
            })).then(() => {
                setOrderCreated(true);
                dispatch(createCart(user?.id)).then(() => {
                    dispatch(fetchCartByIds(user?.id));
                    dispatch(fetchCartItems(cart?.id));
                })
            });
        }
        
    }, [cart, dispatch, user, orderCreated]);

    return (
        <div>
            <h1>Successful payment!</h1>
            <button>
                <Link to={ROUTES.HOME}>Back to home</Link>
            </button> 
        </div>
    );
}
