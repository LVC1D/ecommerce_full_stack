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

export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (productId) => {
        console.log('API call to fetch product by id:', productId);
        try {
            const response = await api.get(`/products/${productId}`);
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
            })
            .addCase(fetchProductById.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.isLoading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default productSlice.reducer;

export const selectProducts = (state) => state.products.products;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectIsLoading = (state) => state.products.isLoading;
export const selectError = (state) => state.products.error;