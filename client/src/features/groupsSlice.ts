import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import type { RootState } from "../app/store";
import type { GroupExtended } from "../models/GroupExtended";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export type GroupsSliceState = {
    groups: null | GroupExtended[],
    loading: boolean,
    error: null | string,
};

const initialState: GroupsSliceState = {
    groups: null,
    loading: false,
    error: null,
};

export const getAllGroups = createAsyncThunk('groups/groupslist', async(_, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.get(`${API_URL}/api/groups`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed getting groups list');
    }
});

export const createGroupAddMembers = createAsyncThunk('groups/addgroup', async(payload: {name: string, description: string, members_ids: number[]}, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.post(`${API_URL}/api/addgroup`, payload, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed adding group');
    }
});

export const deleteGroup = createAsyncThunk('groups/deletegroup', async(payload: {group_id: number}, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.delete(`${API_URL}/api/deletegroup/${payload.group_id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed deleting group');
    }
});

export const leaveGroup = createAsyncThunk('groups/leavegroup', async(payload: {group_id: number}, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.delete(`${API_URL}/api/leavegroup/${payload.group_id}`, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed leaving group');
    }
});

const groupsSlice = createSlice({
    name: 'groups',
    initialState,
    reducers: {},
    extraReducers(builder){
        builder
        .addCase(getAllGroups.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.groups = null;
        })
        .addCase(getAllGroups.fulfilled, (state, action: PayloadAction<{groups: GroupExtended[]}>) => {
            state.loading = false;
            state.groups = action.payload.groups;
            state.error = null;
        })
        .addCase(getAllGroups.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })

        .addCase(createGroupAddMembers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createGroupAddMembers.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(createGroupAddMembers.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })

        .addCase(deleteGroup.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(deleteGroup.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(deleteGroup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })

        .addCase(leaveGroup.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(leaveGroup.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(leaveGroup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })
    }
});

export default groupsSlice.reducer;