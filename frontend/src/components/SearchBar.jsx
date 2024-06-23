import  {setSearchTerm, selectSearchTerm} from '../features/searchSlice';
import { useSelector, useDispatch } from "react-redux";

function SearchBar() {
    const dispatch = useDispatch();
    const searchTerm = useSelector(selectSearchTerm);

    const handleSearchResults = ({target}) => dispatch(setSearchTerm(target.value));
    
    return (
        <form id="search-field">
            <input 
                value={searchTerm}
                onChange={handleSearchResults}
                type="text" 
                placeholder="Search for an item..." />
            <button
                type="button"
            >Search</button>
        </form>
    );
}

export default SearchBar;