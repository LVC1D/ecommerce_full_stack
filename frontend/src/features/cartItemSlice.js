import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../axios';

const initialState = {
    cartItems: [],
    itemQuantity: null,
    loading: false,
    error: null,
};

export const fetchCartItems = createAsyncThunk(
    'cartItems/fetchCartItems',
    async (cartId) => {
        try {
            const response = await api.get(`/cart/${cartId}/items`);
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
);

export const updateCartItemQuantity = createAsyncThunk(
    'cartItems/updateCartItemQuantity',
    async ({ cartId, quantity,productId }) => {
        try {
            const response = await api.put(`/cart-items/${cartId}`, { quantity, productId });
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
);

const cartItemSlice = createSlice({
    name: 'cartItems',
    initialState,
    reducers: {
        addByOne: (state, action) => {
            const { productId } = action.payload;
            const item = state.cartItems.find((item) => item.product_id === productId);
            if (item) {
                item.quantity += 1;
            }
        },
        removeByOne: (state, action) => {
            const { productId } = action.payload;
            const item = state.cartItems.find((item) => item.product_id === productId);
            if (item) {
                item.quantity -= 1;
            }
        },
        setQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.cartItems.find((item) => item.product_id === productId);
            if (item) {
                state.itemQuantity = quantity;
            }
        }
    }
})