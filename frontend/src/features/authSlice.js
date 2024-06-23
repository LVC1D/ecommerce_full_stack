import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../axios'; // Path to your api.js file

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

// Async thunk for user registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password, name, address }) => {
    try {
      const response = await api.post('/api/auth/register', {
        username,
        email,
        password,
        name,
        address,
      });
      return response.data; // Assuming the server responds with the newly registered user
    } catch (error) {
      throw error.response.data; // Throw error for Redux Toolkit to handle
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }) => {
    try {
      const response = await api.post('/api/auth/login', {
        username,
        password,
      });
      return response.data.user; // Assuming the server responds with the logged-in user
    } catch (error) {
      throw error.response.data; // Throw error for Redux Toolkit to handle
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;