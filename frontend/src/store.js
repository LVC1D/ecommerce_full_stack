import {configureStore} from '@reduxjs/toolkit';
import searchReducer from './features/searchSlice';
import authReducer from './features/authSlice';
import productReducer from './features/productSlice';
import orderReducer from './features/orderSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
  }
});