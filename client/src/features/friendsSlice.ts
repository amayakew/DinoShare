import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import type { User } from '../models/User';
import type { RootState } from "../app/store";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export type FriendsSliceState = {
    friends: null | User[],
    loading: boolean,
    error: null | string,
};

const initialState: FriendsSliceState = {
    friends: null,
    loading: false,
    error: null,
};

export const getAllFriends = createAsyncThunk('friends/friendslist', async(_, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.get(`${API_URL}/api/friends`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed getting friends list');
    }
});

const friendsSlice = createSlice({
    name: 'friends',
    initialState,
    reducers: {},
    extraReducers(builder){
        builder
        .addCase(getAllFriends.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.friends = null;
        })
        .addCase(getAllFriends.fulfilled, (state, action: PayloadAction<{friends: User[]}>) => {
            state.friends = action.payload.friends;
            state.loading = false;
            state.error = null;
        })
        .addCase(getAllFriends.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })
    }
});

export default friendsSlice.reducer;