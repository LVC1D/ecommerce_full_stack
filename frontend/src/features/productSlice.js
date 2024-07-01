import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../axios';

const initialState = {
    products: [],
    selectedProduct: null,
    isLoading: false,
    error: null
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        try {
            const response = await api.get('/products');
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.products = action.payload;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;

export const selectProducts = (state) => state.products.products;

export const selectIsLoading = (state) => state.products.isLoading;
export const selectError = (state) => state.products.error;