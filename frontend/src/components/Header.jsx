import {Link} from 'react-router-dom';
import SearchBar from './SearchBar';
import ROUTES from '../routes';

function Header() {
    return (
        <div>
            <SearchBar />
            <button>
                <Link to={ROUTES.LOGIN}>Login</Link>
            </button>
            <button>
                <Link to={ROUTES.REGISTER}>Register</Link>
            </button>
        </div>
    );
}

export default Header;