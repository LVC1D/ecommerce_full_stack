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
        dispatch(fetchCartByIds(user?.id));
    }, [dispatch, user]);

    useEffect(() => {
        dispatch(createCart(user?.id));
    }, [dispatch, user]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleUserTooltip = () => {
        dispatch(toggleTooltip());
    };

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
                                    <Link to={ROUTES.CART(cart?.id)}>
                                        Cart ({cart?.item_count || 0})
                                    </Link>
                                </button>
                                <button>
                                    <Link to={ROUTES.PROFILE(user?.id)}>My profile</Link>
                                </button>
                            </div>
                        }
                        isVisible={userTooltipVisibility}
                    >
                    </UserTooltip>
                    <Link to={ROUTES.PROFILE(user?.id)}>
                        <img src="../src/assets/User_32.png" alt="User Logo" />
                    </Link>
                    <Link to={ROUTES.CART(cart?.id)}>
                        <div className='count-container'>
                            <img src="../src/assets/Cart_32.png" alt="Cart Logo" />
                            <span id="count">{cart?.item_count || 0}</span>
                        </div>
                    </Link>
                    <button onClick={handleLogout}>Log Out</button>
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
