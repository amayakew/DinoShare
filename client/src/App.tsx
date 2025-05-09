import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "./app/store";

import GroupsPage from "./pages/GroupsPage";
import SignUpPage from './pages/SignUpPage';
import LogInPage from "./pages/LogInPage";
import { refreshToken } from "./features/users/usersSlice";

import './App.css';
import FriendsPage from "./pages/FriendsPage";
import AccountPage from "./pages/AccountPage";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.users.isLoggedIn);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <>
      <Routes>
        <Route path="*" element={<Navigate to="/login"/>}/>
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/groups"/> : <SignUpPage/>}/>
        <Route path="/login" element={isLoggedIn ? <Navigate to="/groups"/> : <LogInPage/>}/>
        <Route path="/groups" element={isLoggedIn ? <GroupsPage/> : <Navigate to="/login"/>}/>
        <Route path="/friends" element={isLoggedIn ? <FriendsPage/> : <Navigate to="/login"/>}/>
        <Route path="/account" element={isLoggedIn ? <AccountPage/> : <Navigate to="/login"/>}/>
      </Routes>
    </>
  );
};
export default App;