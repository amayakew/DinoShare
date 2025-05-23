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

export const addNewFriend = createAsyncThunk('users/addfriend', async(payload: {friend_id: number}, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.post(`${API_URL}/api/addfriend`, payload, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed adding new friend');
    }
});

export const deleteFriend = createAsyncThunk('users/deletefriend', async(payload: {friend_id: number}, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.delete(`${API_URL}/api/deletefriend/${payload.friend_id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });
        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed friend delete');
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
            state.loading = false;
            state.friends = action.payload.friends;
            state.error = null;
        })
        .addCase(getAllFriends.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })

        .addCase(addNewFriend.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addNewFriend.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(addNewFriend.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })

        .addCase(deleteFriend.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteFriend.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(deleteFriend.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })
    }
});

export default friendsSlice.reducer;