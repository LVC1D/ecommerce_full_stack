import {configureStore} from '@reduxjs/toolkit';
import searchReducer from './features/searchSlice';
import authReducer from './features/authSlice';
import productReducer from './features/productSlice';
import orderReducer from './features/orderSlice';
import cartReducer from './features/cartSlice';
import userTooltipReducer from './features/userTooltipSlice';
import userReducer from './features/userSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    cart: cartReducer,
    userTooltip: userTooltipReducer,
    user: userReducer,
  }
});