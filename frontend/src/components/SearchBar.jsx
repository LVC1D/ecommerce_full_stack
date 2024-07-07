import {setSearchTerm, selectSearchTerm} from '../features/searchSlice';
import {fetchProductsBySearchTerm} from '../features/productSlice'; 
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';

function SearchBar() {
    const dispatch = useDispatch();
    const searchTerm = useSelector(selectSearchTerm);

    const handleSearchResults = ({target}) => dispatch(setSearchTerm(target.value));
    const handleSubmit = (e) => {
        e.preventDefault();
        if (searchTerm) {
            dispatch(fetchProductsBySearchTerm(searchTerm));
        }
    };
    
    return (
        <form id="search-field" onSubmit={handleSubmit}>
            <input 
                value={searchTerm}
                onChange={handleSearchResults}
                type="text" 
                placeholder="Search for an item..." />
            <button
                type="submit"
            >Search</button>
        </form>
    );
}

export default SearchBar;