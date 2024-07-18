import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../axios';

const initialState = {
    isLoading: true,
    hasError: false,
    error: null,
    isSuccess: true,
};

export const fetchUserById = createAsyncThunk(
    'user/fetchUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            return rejectWithValue(error.response?.data || 'Error fetching user');
        }
    }
);

export const updateUser = createAsyncThunk(
    'user/updateUser',
    async ({ userId, username, address }, { rejectWithValue }) => {
        if (!userId || !username || !address) {
            return rejectWithValue('Invalid input');
        }

        try {
            const response = await api.put(`/users/${userId}`, { username, address });
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            return rejectWithValue(error.response?.data || 'Error updating user');
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserById.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.isSuccess = false;
            })
            .addCase(fetchUserById.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = false;
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.isLoading = false;
                state.hasError = true;
                state.isSuccess = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true;
                state.hasError = false;
                state.isSuccess = false;
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
            })
            .addCase(updateUser.rejected, (state) => {
                state.isLoading = false;
                state.hasError = true;
                state.isSuccess = false;
            });
    },
});

export default userSlice.reducer;