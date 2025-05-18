import { Card, Box, List, ListItemAvatar, ListItemText, ListItem, CircularProgress, Alert, IconButton, Tooltip } from "@mui/material";
import { PersonRemoveRounded } from "@mui/icons-material";
import Navbar from "../../components/nav/Navbar";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { useEffect } from "react";
import { getAllFriends, deleteFriend } from "../../features/friendsSlice";
import FirstLetterAvatar from "../../components/FirstLetterAvatar";
import AddButtonToNewPage from "../../components/buttons/AddButtonToNewPage";

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
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5}}>
                <AddButtonToNewPage page={"/addfriend"}/>
                {!loading && noFriends && <Alert severity="success" sx={{width: '60%'}}>Press the + button to add friends</Alert>}
                {(friends?.length || 0) > 0 && <Card sx={{width: '60%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', mt: 2}}>
                    {loading && <CircularProgress size={24} color="inherit" />}
                    {error && (<Alert severity="error">{error}</Alert>)}
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {friends?.map(friend => {
                                const handleDelete = async() => {
                                    await dispatch(deleteFriend({friend_id: friend.id}));
                                    dispatch(getAllFriends());
                                };

                            return (
                                <ListItem key={friend.id} sx={{display: 'flex', alignItems: 'center', padding: '8px 80px'}}>
                                    <ListItemAvatar>
                                        <FirstLetterAvatar text={friend?.username} />
                                    </ListItemAvatar>
                                    <ListItemText primary={friend?.username} secondary={friend?.email}/>
                                    <Tooltip title="Remove from friends">
                                        <IconButton 
                                            sx={{ 
                                                border: '1px solid',
                                                borderColor: 'transparent',
                                                color: 'primary.main',
                                                float: 'right',
                                                '&:hover': {color: 'primary.dark', border: '1px solid', borderColor: 'primary.main',}
                                            }}
                                            onClick={handleDelete}
                                        >
                                            <PersonRemoveRounded/>
                                        </IconButton>
                                    </Tooltip>
                                </ListItem>
                            )
                        })}
                    </List>
                </Card>
                }       
            </Box>
        </>
    );
};

export default FriendsPage;