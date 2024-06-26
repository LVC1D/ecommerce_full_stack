import { Link } from 'react-router-dom';
import SearchBar from './SearchBar';
import ROUTES from '../routes';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser, checkLoginStatus } from '../features/authSlice';
import { useEffect } from 'react';

function Header() {
    const { user, status, error, isAuth } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    useEffect(() => {
        dispatch(checkLoginStatus());
    }, [dispatch]);

    return (
        <div>
            {isAuth && user ? (
                <div>
                    <h2>Welcome, {user?.name}</h2>
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
