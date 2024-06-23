import {configureStore} from '@reduxjs/toolkit';
import searchReducer from './features/searchSlice';
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
    search: searchReducer,
    auth: authReducer,
  }
});