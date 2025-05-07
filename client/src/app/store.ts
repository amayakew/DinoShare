import { configureStore, combineReducers } from "@reduxjs/toolkit";
import usersReducer from '../features/users/usersSlice';

const appReducers = combineReducers({
    users: usersReducer,
});

const store = configureStore({
    reducer:appReducers
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;