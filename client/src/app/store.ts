import { configureStore, combineReducers } from "@reduxjs/toolkit";
import usersReducer from '../features/usersSlice';
import friendsReducer from '../features/friendsSlice';

const appReducers = combineReducers({
    users: usersReducer,
    friends: friendsReducer,
});

const store = configureStore({
    reducer:appReducers
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;