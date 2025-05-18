import { configureStore, combineReducers } from "@reduxjs/toolkit";
import usersReducer from '../features/usersSlice.js';
import friendsReducer from '../features/friendsSlice.js';
import groupsReducer from '../features/groupsSlice.js';
import expensesReducer from '../features/expensesSlice.js';

const appReducers = combineReducers({
    users: usersReducer,
    friends: friendsReducer,
    groups: groupsReducer,
    expenses: expensesReducer,
});

const store = configureStore({
    reducer:appReducers
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;