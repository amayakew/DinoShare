import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import type { RootState } from "../app/store";
import type { UserWithBalance } from "../models/UserWithBalance.ts";

const API_URL = import.meta.env.VITE_API_BASE_URL;

type UsersSliceState = {
    refreshTokenLoading: boolean,
    users: null | UserWithBalance[],
    user: UserWithBalance | null,
    authToken: string | null,
    isLoggedIn: boolean,
    loading: boolean,
    errorFetch: string | null,
    errorSignup: string | null,
    errorLogin: string | null,
};

const initialState: UsersSliceState = {
    refreshTokenLoading: true,
    users: null,
    user: null,
    authToken: null,
    isLoggedIn: false,
    loading: false,
    errorFetch: null,
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

export const getAllUsers = createAsyncThunk('users/getUsers', async(_, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.get(`${API_URL}/api/addfriend`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed getting users list');
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        logout: (state) => {
            Object.assign(state, initialState);
            state.refreshTokenLoading = false;
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
        .addCase(loginUser.fulfilled, (state: UsersSliceState, action: PayloadAction<{user: UserWithBalance, token: string}>) => {
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
            state.refreshTokenLoading = true;
        })
        .addCase(refreshToken.fulfilled, (state, action: PayloadAction<{user: UserWithBalance, token: string}>) => {
            state.refreshTokenLoading = false;
            state.isLoggedIn = true;
            state.user = action.payload.user;
            state.authToken = action.payload.token;
        })
        .addCase(refreshToken.rejected, (state) => {
            state.refreshTokenLoading = false;
            state.user = null;
            state.authToken = null;
            state.isLoggedIn = false;
        })

        .addCase(getAllUsers.pending, (state) => {
            state.loading = true;
            state.errorFetch = null;
            state.users = null;
        })
        .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<{users: UserWithBalance[]}>) => {
            state.loading = false;
            state.errorFetch = null;
            state.users = action.payload.users;
        })
        .addCase(getAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.errorFetch = action.payload as string || 'Unexpected error';
        })
    }
});

export const { logout } = usersSlice.actions;
export default usersSlice.reducer;