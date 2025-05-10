import { Container, List, ListItemAvatar, ListItemText, ListItemButton, CircularProgress, Alert, IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import Navbar from "../components/Navbar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { useEffect } from "react";
import { getAllFriends } from "../features/friendsSlice";
import { NavLink } from "react-router-dom";
import FirstLetterAvatar from "../components/FirstLetterAvatar";

const FriendsPage = () => {
    const {friends, loading, error} = useSelector((state: RootState) => state.friends);
    const dispatch = useDispatch<AppDispatch>();
    const noFriends = friends != null && friends.length == 0;

    useEffect(() => {
        dispatch(getAllFriends())
    },[dispatch]);

    return (
        <>
            <Navbar/>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <IconButton component={NavLink} to="/addfriend" sx={{
                    backgroundColor: 'primary.main', 
                    '&:hover': {backgroundColor: 'primary.dark'},
                    color: 'white',
                    float: 'right'
                }}>
                    <Add/>
                </IconButton>
                {loading && <CircularProgress size={24} color="inherit" />}
                {error && (<Alert severity="error">{error}</Alert>)}
                {!loading && noFriends && <Alert severity="success">Press the + button to add friends</Alert>}
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {friends?.map(friend => {
                        return (
                            <ListItemButton key={friend.id}>
                                <ListItemAvatar>
                                    <FirstLetterAvatar text={friend?.username} />
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