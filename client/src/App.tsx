import { Navigate, Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { AppDispatch, RootState } from "./app/store";

import GroupsPage from "./pages/groups/GroupsPage";
import SignUpPage from './pages/auth/SignUpPage';
import LogInPage from "./pages/auth/LogInPage";
import { refreshToken } from "./features/usersSlice";

import './App.css';
import FriendsPage from "./pages/friends/FriendsPage";
import AddFriendPage from "./pages/friends/AddFriendPage";
import CreateGroupPage from "./pages/groups/CreateGroupPage";
import { ThemeProvider } from "@emotion/react";
import theme from "./app/theme";
import GroupDetailsPage from "./pages/groups/GroupDetailsPage";
import { CircularProgress } from "@mui/material";

function App() {
  const {isLoggedIn, refreshTokenLoading} = useSelector((state: RootState) => state.users);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(refreshToken());
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      {refreshTokenLoading && <CircularProgress size={48} color="inherit" />}
      {!refreshTokenLoading && <Routes>
          <Route path="*" element={<Navigate to="/login"/>}/>
          <Route path="/signup" element={isLoggedIn ? <Navigate to="/groups"/> : <SignUpPage/>}/>
          <Route path="/login" element={isLoggedIn ? <Navigate to="/groups"/> : <LogInPage/>}/>
          <Route path="/groups" element={isLoggedIn ? <GroupsPage/> : <Navigate to="/login"/>}/>
          <Route path="/addgroup" element={isLoggedIn ? <CreateGroupPage/> : <Navigate to="/login"/>}/>
          <Route path="/groupdetails/:id" element={isLoggedIn ? <GroupDetailsPage/> : <Navigate to="/login"/>}/>
          <Route path="/friends" element={isLoggedIn ? <FriendsPage/> : <Navigate to="/login"/>}/>
          <Route path="/addfriend" element={isLoggedIn ? <AddFriendPage/> : <Navigate to="/login"/>}/>
      </Routes>}
    </ThemeProvider>
  );
};
export default App;