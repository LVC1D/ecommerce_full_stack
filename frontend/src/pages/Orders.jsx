import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectOrders, selectIsLoading, selectError, fetchOrders } from "../features/orderSlice";

function Orders () {

    const dispatch = useDispatch();
    const orders = useSelector(selectOrders);
    const isLoading = useSelector(selectIsLoading);
    const error = useSelector(selectError);

    const {user, isAuth} = useSelector((state) => state.auth);
    
    useEffect(() => {
        if (isAuth && user?.id) dispatch(fetchOrders(user.id));
    }, [dispatch, isAuth, user?.id]);

    return (
        <div>
            <h1>Orders of {user?.username}</h1>
            {isLoading && <p>Loading...</p>}
            {isAuth ? (
                orders.map((order) => (
                    <div key={order.id}>
                        <h3>Order ID: {order.id}</h3>
                        <p>Order Date: {order.order_date}</p>
                        <p>Total: {order.order_sum}</p>
                    </div>
                ))
            ) : (
                <p>Please log in to see your orders.</p>
            )}
            {error && <p>{error.message}</p>}
        </div>
    )
}

export default Orders;