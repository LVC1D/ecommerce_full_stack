import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { setUser } from "../features/authSlice";
import { createOrder, fetchCartItems } from "../features/cartItemSlice";
import { createCart, fetchCartByIds } from "../features/cartSlice";
import ROUTES from "../routes";

export default function Success() {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const { user, isAuth } = useSelector((state) => state.auth);
    const [orderCreated, setOrderCreated] = useState(false);

    useEffect(() => {
        if (cart && user && cart.item_count > 0 && !orderCreated) {
            dispatch(createOrder({
                cartId: cart.id,
                userId: user.id,
                orderSum: cart.sub_total
            }))
            .then(() => {
                dispatch(createCart(user.id)).then(() => {
                    dispatch(fetchCartByIds(user.id));
                });
            })
            setOrderCreated(true)
        }
    }, [cart, dispatch, orderCreated, user]);
    
    useEffect(() => {
        dispatch(setUser(isAuth));
    }, [isAuth, dispatch]);

    return (
        <div>
            <h1>Successful payment!</h1>
            <button>
                <Link to={ROUTES.HOME}>Back to home</Link>
            </button> 
        </div>
    );
}
