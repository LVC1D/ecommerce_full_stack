import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import api from '../axios';
import {loadStripe} from '@stripe/stripe-js';

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

export const updateCart = createAsyncThunk(
    'cartItems/updateCart',
    async ({ cartId, items }) => {
        try {
            const response = await api.put(`/cart/${cartId}`, { items });
            console.log('Response:', response.data);
            return response.data;
        } catch (error) {
            throw new Error(error.response.data.message || 'Failed to update cart');
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cartItems/removeFromCart',
    async ({cartId, productId}) => {
        try {
            const response = await api.delete(`/cart/${cartId}/items/${productId}`);
            console.log('Response:', response.data)
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
)

export const makePayment = createAsyncThunk(
    'cartItems/makePayment',
    async (cartId, { getState }) => {
        const stripe = await loadStripe('pk_test_51PRwp300S9GEcTS4vjzkKyI6tJYHChAXPBEG3Gu64COTqlATyKlibDv4eYyJZ5YkPeaS6q5fQncD4QkWJuK9zWU500SCWXlrmq');
        const state = getState();
        const body = JSON.stringify({
            products: state.cartItems.cartItems,
        });
        const response = await api.post(`/cart/${cartId}/create-checkout`, body);
        const session = response.data;

        const result = stripe.redirectToCheckout({
            sessionId: session.id,
        });
        return result;
    }
);

export const createOrder = createAsyncThunk(
    'cartItems/createOrder',
    async ({cartId, userId, orderSum}) => {
        try {
            const response = await api.post(`/cart/${cartId}/checkout`, {userId, orderSum});
            return response.data;
        } catch (error) {
            return error.response.data;
        }
    }
)

const cartItemSlice = createSlice({
    name: 'cartItems',
    initialState,
    reducers: {
        addByOne: (state, action) => {
            const { productId } = action.payload;
            const item = state.cartItems.find((item) => item.productId === productId);
            if (item) {
                item.quantity += 1;
            }
        },
        removeByOne: (state, action) => {
            const { productId } = action.payload;
            const item = state.cartItems.find((item) => item.productId === productId);
            if (item) {
                item.quantity -= 1;
            }
        },
        setQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const item = state.cartItems.find((item) => item.productId === productId);
            if (item) {
                state.itemQuantity = quantity;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartItems.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(fetchCartItems.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload;
            })
            .addCase(fetchCartItems.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateCart.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(updateCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = action.payload.cartItems;
            })
            .addCase(updateCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = state.cartItems.filter(item => item.product_id !== action.payload.productId);
            })
            .addCase(makePayment.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(makePayment.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(makePayment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createOrder.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.cartItems = [];
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default cartItemSlice.reducer;
export const { addByOne, removeByOne, setQuantity } = cartItemSlice.actions;