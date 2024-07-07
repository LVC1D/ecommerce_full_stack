import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../axios';

const initialState = {
    cart: null,
    isLoading: false,
    error: null
};

export const fetchCartByIds = createAsyncThunk(
    'cart/fetchCartByIds',
    async (userId) => {
        try {
            const response = await api.get(`/cart?userId=${userId}`);
            // console.log(response.data);
            return response.data;
        } catch (error) {
            console.error("Error fetching cart by IDs:", error.response?.data || error.message);
            throw error.response?.data || error.message;
        }
    }
);

export const createCart = createAsyncThunk(
    'cart/createCart',
    async (userId) => {
        try {
            const response = await api.post('/cart?userId=' + userId);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ cartId, productId }) => {
        try {
            const response = await api.post(`/cart/${cartId}`, { productId });
            // console.log(response.data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartByIds.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCartByIds.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload;
            })
            .addCase(fetchCartByIds.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(createCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload;
            })
            .addCase(createCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(addToCart.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.isLoading = false;
                state.cart = action.payload;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default cartSlice.reducer;
