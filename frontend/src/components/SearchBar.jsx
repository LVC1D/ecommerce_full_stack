import {setSearchTerm, selectSearchTerm, clearSearchTerm} from '../features/searchSlice';
import {fetchProductsBySearchTerm} from '../features/productSlice'; 
import { useSelector, useDispatch } from "react-redux";
import {searchIconUrl, clearIconUrl} from '../assets/searchIcons';
import {useState, useEffect} from 'react';

function SearchBar() {
    const dispatch = useDispatch();
    const searchTerm = useSelector(selectSearchTerm);
    // const darkThemeSearchIcon = '/frontend/src/assets/Search_White_Icon.svg';
    // const darkThemeClearIcon = '/frontend/src/assets/Clear_White_Icon.svg';

    // const [searchIcon, setSearchIconUrl] = useState(searchIconUrl);
    // const [clearIcon, setClearIconUrl] = useState(clearIconUrl);

    const clearSearch = () => dispatch(clearSearchTerm());
    const handleSearchResults = ({target}) => dispatch(setSearchTerm(target.value));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            dispatch(fetchProductsBySearchTerm(searchTerm));
        }
    };
    
    return (
        <form id="search-field" onSubmit={handleSubmit}>
            <div id="search-container">
                <input
                    type="text" 
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchResults}
                    className="search-input" />
                <button type="submit" className="search-icon-button">
                    <img src={searchIconUrl} alt="Search" />
                </button>
                {searchTerm && (
                <button 
                    type="button" 
                    className="search-clear-button" 
                    onClick={clearSearch}
                >
                    <img src={clearIconUrl} alt="Clear" />
                </button>
            )}
            </div>
        </form>
    );
}

export default SearchBar;