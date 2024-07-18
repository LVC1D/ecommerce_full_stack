import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectOrders, selectIsLoading, selectError, fetchOrders } from "../features/orderSlice";
import './Orders.css';

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
        <div className="orders-container">
            <div className="orders-header">
                <h1>Orders of {user?.name}</h1>
            </div>
            <div className="orders-list">
                {isLoading && <p className="message">Loading...</p>}
                {isAuth ? (
                    orders.map((order) => (
                        <div key={order.id} className="order-item">
                            <h3>Order ID: {order.id}</h3>
                            <p>Order Date: {order.order_date.split('T')[0]}</p>
                            <p>Total: {order.order_sum}</p>
                        </div>
                    ))
                ) : (
                    <p className="message">Please log in to see your orders.</p>
                )}
                {error && <p className="message error">{error.message}</p>}
            </div>
        </div>
    )
}

export default Orders;