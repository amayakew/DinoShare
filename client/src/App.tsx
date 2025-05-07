import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "./app/store";

import HomePage from "./pages/HomePage";
import SignUpPage from './pages/SignUpPage';
import LogInPage from "./pages/LogInPage";
import { refreshToken } from "./features/users/usersSlice";

import './App.css';

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.users.isLoggedIn);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="/home" element={isLoggedIn ? <HomePage/> : <Navigate to="/login"/>}/>
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/home"/> : <SignUpPage/>}/>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/home"/> : <LogInPage/>}/>
        <Route path="*" element={<Navigate to="/login"/>}/>
      </Routes>
    </>
  );
};
export default App;