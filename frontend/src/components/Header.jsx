import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ROUTES from '../routes';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, checkLoginStatus } from '../features/authSlice';
import { fetchCartByIds, createCart } from '../features/cartSlice';
import { useEffect, useState } from 'react';
import UserTooltip from './UserTooltip';
import {selectUserTooltipVisibility, toggleTooltip} from '../features/userTooltipSlice';
import CartItems from '../pages/CartItems';

function Header() {
    const { user, isAuth } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    const userTooltipVisibility = useSelector(selectUserTooltipVisibility);
    const dispatch = useDispatch();
    const [isCartModalVisible, setCartModalVisible] = useState(false);

    // useEffect(() => {
    //     dispatch(fetchCartByIds(user?.id));
    // }, [dispatch, isAuth, user]);

    // useEffect(() => {
    //     dispatch(createCart(user?.id));
    // }, [dispatch, user]);

    useEffect(() => {
        if (isAuth && user) {
            dispatch(fetchCartByIds(user.id));
        }
    }, [dispatch, isAuth, user]);
    
    useEffect(() => {
        if (isAuth && user) {
            dispatch(createCart(user.id));
        }
    }, [dispatch, isAuth, user]);

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    const handleUserTooltip = () => {
        dispatch(toggleTooltip());
    };

    const toggleCartModal = () => {
        setCartModalVisible(!isCartModalVisible);
    };

    // console.log('Is auth:', isAuth);

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
                            </div>
                        }
                        isVisible={userTooltipVisibility}
                    >
                    </UserTooltip>
                    <Link to={ROUTES.PROFILE(user?.id)}>
                        <img src="../src/assets/User_32.png" alt="User Logo" />
                    </Link>
                    
                    <div className='count-container' onClick={toggleCartModal} style={{ cursor: 'pointer' }} >
                        <span><img src="../src/assets/Cart_32.png" alt="Cart Logo" /></span>
                        <span id="count">{cart?.item_count || 0}</span>
                    </div>
                    {isCartModalVisible && <CartItems isVisible={isCartModalVisible} onClose={toggleCartModal} />}
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
