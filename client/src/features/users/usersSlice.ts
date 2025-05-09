import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import type { User } from '../../models/User';

const API_URL = import.meta.env.VITE_API_BASE_URL;

export type UsersSliceState = {
    user: User | null,
    authToken: string | null,
    isLoggedIn: boolean,
    loading: boolean,
    errorSignup: string | null,
    errorLogin: string | null,
};

const initialState: UsersSliceState = {
    user: null,
    authToken: null,
    isLoggedIn: false,
    loading: false,
    errorSignup: null,
    errorLogin: null,
};

export const signupUser = createAsyncThunk('users/signup', async(payload: {username: string, email: string, password: string}, {rejectWithValue}) => {
    try {
        const res = await axios.post(`${API_URL}/api/register`, payload);
        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
});

export const loginUser = createAsyncThunk('users/login', async(payload: {email: string, password: string}, { rejectWithValue }) => {
    try {
        const res = await axios.post(`${API_URL}/api/login`, payload, {withCredentials: true});
        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
});

export const refreshToken  = createAsyncThunk('users/refreshToken', async(_, {rejectWithValue}) => {
    try {
        const res = await axios.post(`${API_URL}/api/refreshToken`, null, {withCredentials: true});
        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Refresh token failed');
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        logout: (state) => {
            Object.assign(state, initialState);
            document.cookie = "refreshToken=;";

        },
    },
    extraReducers(builder){
        builder
        .addCase(signupUser.pending, (state) => {
            state.loading = true;
            state.errorSignup = null;
        })
        .addCase(signupUser.fulfilled, (state) => {
            state.loading = false;
        })
        .addCase(signupUser.rejected, (state, action) => {
            state.loading = false;
            state.errorSignup = action.payload as string || 'Unexpected error';
        })

        .addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.errorLogin = null;
        })
        .addCase(loginUser.fulfilled, (state: UsersSliceState, action: PayloadAction<{user: User, token: string}>) => {
            state.loading = false;
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.authToken = action.payload.token;
        })
        .addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.errorLogin = action.payload as string || 'Unexpected error';
        })

        .addCase(refreshToken.pending, (state) => {
            state.loading = true;
        })
        .addCase(refreshToken.fulfilled, (state, action: PayloadAction<{user: User, token: string}>) => {
            state.loading = false;
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.authToken = action.payload.token;
        })
        .addCase(refreshToken.rejected, (state) => {
            state.loading = false;
            state.user = null;
            state.authToken = null;
            state.isLoggedIn = false;
        })
    }
});

export const { logout } = usersSlice.actions;
export default usersSlice.reducer;