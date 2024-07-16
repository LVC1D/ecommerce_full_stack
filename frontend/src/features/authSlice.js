import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../axios'; // Path to your api.js file

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  isAuth: false,
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
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

// Async thunk for user login
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }) => {
    try {
      const { data } = await api.post('/api/auth/login', {
        username,
        password,
      });
      return data;
    } catch (error) {
      throw error.response.data;
    }
  }
);

export const checkLoginStatus = createAsyncThunk(
  'auth/checkStatus',
  async () => {
    try {
      const response = await api.get('/api/auth/is_logged_in', {withCredentials: true});
      return response.data;
    } catch (error) {
      return {
        user: null,
        isAuth: false,
      };
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
    },
    logoutUser: (state) => {
      state.user = null;
      state.status = 'idle';
      state.isAuth = false;
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
        state.isAuth = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isAuth = false;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuth = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.user = null;
        state.isAuth = false;
      })
      .addCase(checkLoginStatus.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkLoginStatus.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.isAuth = action.payload.isAuth || true || false;
      })
      .addCase(checkLoginStatus.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
        state.isAuth = false;
      });
  },
});

export const { setUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
