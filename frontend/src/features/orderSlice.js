import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import api from '../axios';

const initialState = {
    orders: [],
    isLoading: false,
    error: null
};

// to fix this
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (userId) => {
        try {
            const response = await api.get('/orders?userId=' + userId);
            console.log(response.data);
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }
);

export const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.isLoading = false;
                state.orders = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;

export const selectOrders = (state) => state.orders.orders;
export const selectIsLoading = (state) => state.orders.isLoading;
export const selectError = (state) => state.orders.error;