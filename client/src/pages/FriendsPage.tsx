import { Container, List, ListItemAvatar, Avatar, ListItemText, ListItemButton, CircularProgress, Alert } from "@mui/material";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { useEffect } from "react";
import { getAllFriends } from "../features/friendsSlice";

const FriendsPage = () => {
    const {friends, loading, error} = useSelector((state: RootState) => state.friends);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllFriends())
    },[dispatch]);

    return (
        <>
            <Navbar/>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                {loading && <CircularProgress size={24} color="inherit" />}
                {error && (<Alert severity="error">{error}</Alert>)}
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {friends?.map(friend => {
                    return (
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar sx={{ width: 32, height: 32 }}>{friend?.username[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={friend?.username} secondary={friend?.email}/>
                        </ListItemButton>
                    )
                })}
            </List>
            </Container>
        </>
    );
};

export default FriendsPage;