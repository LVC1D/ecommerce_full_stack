import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ROUTES from '../routes';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, checkLoginStatus } from '../features/authSlice';
import { fetchCartByIds, createCart } from '../features/cartSlice';
import { useEffect } from 'react';

function Header() {
    const { user, isAuth } = useSelector((state) => state.auth);
    const { cart, isLoading } = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user && isAuth) {
            const fetchOrCreateCart = async () => {
                try {
                    await dispatch(fetchCartByIds(user.id)).unwrap();
                } catch (error) {
                    if (error === 'Cart not found') {
                        await dispatch(createCart(user.id)).unwrap();
                    }
                }
            };
            fetchOrCreateCart();
        }
    }, [dispatch, user, isAuth]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    useEffect(() => {
        dispatch(checkLoginStatus());
    }, [dispatch]);

    return (
        <div>
            <button>
                <Link to={ROUTES.HOME}>To home</Link>
            </button>
            {user ? (
                <div>
                    <h2>Welcome, {user?.name}</h2>
                    <button>
                        <Link to={ROUTES.ORDERS}>My orders</Link>
                    </button>
                    <button>
                        Cart ({cart?.item_count || 0})
                    </button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            ) : (
                <div>
                    <button>
                        <Link to={ROUTES.LOGIN}>Login</Link>
                    </button>
                    <button>
                        <Link to={ROUTES.REGISTER}>Register</Link>
                    </button>
                </div>
            )}
            <SearchBar />
        </div>
    );
}

export default Header;
