import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../features/cartItemSlice";

export default function Success() {
    const dispatch = useDispatch();
    const { cart } = useSelector((state) => state.cart);
    const {user} = useSelector((state) => state.auth);

    useEffect(() => {
        if (user && cart) {
            dispatch(createOrder({
                cartId: cart?.id,
                userId: user?.id,
                orderSum: cart.sub_total
            }));
        }
    }, [dispatch, cart, user])
    
    return (
        <div>
            <h1>Successful payment!</h1>
        </div>
    )
}