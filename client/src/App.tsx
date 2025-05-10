import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "./app/store";

import GroupsPage from "./pages/GroupsPage";
import SignUpPage from './pages/SignUpPage';
import LogInPage from "./pages/LogInPage";
import { refreshToken } from "./features/usersSlice";

import './App.css';
import FriendsPage from "./pages/FriendsPage";
import AccountPage from "./pages/AccountPage";
import AddFriendPage from "./pages/AddFriendPage";
import CreateGroupPage from "./pages/CreateGroupPage";
import { ThemeProvider } from "@emotion/react";
import theme from "./app/theme";

function App() {
  const isLoggedIn = useSelector((state: RootState) => state.users.isLoggedIn);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Routes>
          <Route path="*" element={<Navigate to="/login"/>}/>
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/groups"/> : <SignUpPage/>}/>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/groups"/> : <LogInPage/>}/>
          <Route path="/groups" element={isLoggedIn ? <GroupsPage/> : <Navigate to="/login"/>}/>
          <Route path="/friends" element={isLoggedIn ? <FriendsPage/> : <Navigate to="/login"/>}/>
          <Route path="/account" element={isLoggedIn ? <AccountPage/> : <Navigate to="/login"/>}/>
          <Route path="/addfriend" element={isLoggedIn ? <AddFriendPage/> : <Navigate to="/login"/>}/>
          <Route path="/addgroup" element={isLoggedIn ? <CreateGroupPage/> : <Navigate to="/login"/>}/>
      </Routes>
    </ThemeProvider>
  );
};
export default App;