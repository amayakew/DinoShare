import { createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios, { AxiosError } from 'axios';
import type { RootState } from "../app/store";
import type { Expense } from "../models/Expense";
import type { Refund } from "../models/Refund";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export type ExpensesSliceState = {
    expenses: null | Expense[],
    refunds: null | Refund[],
    loading: boolean,
    error: null | string,
};

const initialState: ExpensesSliceState = {
    expenses: null,
    refunds: null,
    loading: false,
    error: null,
};

export const addExpense = createAsyncThunk('expenses/addexpense', async(payload: { group_id: number, name: string, currency: string, price: number }, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.post(`${API_URL}/api/addexpense`, payload, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed adding group');
    }
});

export const addRefund = createAsyncThunk('expenses/addrefund', async(payload: { group_id: number, receiving_member_id: number, currency: string, price: number }, {getState, rejectWithValue}) => {
    try {
        const token = (getState() as RootState).users.authToken;
        const res = await axios.post(`${API_URL}/api/addrefund`, payload, {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true
        });

        return res.data;
    } catch (e: unknown) {
        const error = e as AxiosError<{ message: string }>;
        return rejectWithValue(error.response?.data?.message || 'Failed adding group');
    }
});

const expensesSlice = createSlice({
    name: 'expenses',
    initialState,
    reducers: {},
    extraReducers(builder){
        builder
        .addCase(addExpense.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addExpense.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(addExpense.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })

        .addCase(addRefund.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(addRefund.fulfilled, (state) => {
            state.loading = false;
            state.error = null;
        })
        .addCase(addRefund.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string || 'Unexpected error';
        })
    }
});

export default expensesSlice.reducer;