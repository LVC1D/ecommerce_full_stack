import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ROUTES from '../routes';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, checkLoginStatus } from '../features/authSlice';
import { fetchCartByIds, createCart } from '../features/cartSlice';
import { useEffect } from 'react';
import UserTooltip from './UserTooltip';
import {selectUserTooltipVisibility, toggleTooltip} from '../features/userTooltipSlice';

function Header() {
    const { user, isAuth } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    const userTooltipVisibility = useSelector(selectUserTooltipVisibility);
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

    const handleUserTooltip = () => {
        dispatch(toggleTooltip());
    }

    return (
        <div className='nav-bar'>
            <button>
                <Link to={ROUTES.HOME}>To home</Link>
            </button>
            <SearchBar />
            {user ? (
                <div className='nav-bar-logged-in'>
                    <h2>Hi there, <span onClick={handleUserTooltip} style={{cursor: 'pointer', textDecoration: 'underline'}}>{user?.name}</span></h2>
                    <UserTooltip
                        content={
                            <div>
                                <button>
                                    <Link to={ROUTES.ORDERS}>My orders</Link>
                                </button>
                                <button>
                                    Cart ({cart?.item_count || 0})
                                </button>
                                <button>
                                    <Link to={ROUTES.PROFILE(user?.id)}>My prodile</Link>
                                </button>
                            </div>
                        }
                        isVisible={userTooltipVisibility}
                    >
                    </UserTooltip>
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
        </div>
    );
}

export default Header;
