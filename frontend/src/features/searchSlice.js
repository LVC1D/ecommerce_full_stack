import { createSlice } from "@reduxjs/toolkit";

export const searchSlice = createSlice({
    name: 'search',
    initialState: "",
    reducers: {
        setSearchTerm: (state, action) => (state = action.payload),
        clearSearchTerm: () => "",
    },
})

export default searchSlice.reducer;
export const {setSearchTerm, clearSearchTerm} = searchSlice.actions;
export const selectSearchTerm = state => state.search;