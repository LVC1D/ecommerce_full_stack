import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../features/cartItemSlice";
import { fetchCartByIds, createCart } from "../features/cartSlice";

export default function Success() {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const {user} = useSelector((state) => state.auth);
    const [orderCreated, setOrderCreated] = useState(false);

    useEffect(() => {
        if (cart && !orderCreated) {
            dispatch(createOrder({
                cartId: cart?.id,
                userId: user?.id,
                orderSum: cart.sub_total
            })).then(() => {
                setOrderCreated(true);
                dispatch(fetchCartByIds(user?.id)); // Fetch new cart after order is created
            });
        }
    }, [dispatch, cart, user, orderCreated]);

    useEffect(() => {
        if (orderCreated) {
            dispatch(createCart(user?.id)); // Create a new cart
        }
    }, [dispatch, user, orderCreated]);
    
    return (
        <div>
            <h1>Successful payment!</h1>   
        </div>
    )
}