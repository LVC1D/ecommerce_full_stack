import {configureStore} from '@reduxjs/toolkit';
import searchReducer from './features/searchSlice';
import authReducer from './features/authSlice';
import productReducer from './features/productSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
    products: productReducer,
  }
});