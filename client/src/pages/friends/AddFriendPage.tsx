import { Container, CircularProgress, Alert, List, ListItemButton, ListItemAvatar, ListItemText, IconButton, AppBar, Toolbar } from "@mui/material";
import type { RootState, AppDispatch } from "../../app/store";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAllUsers } from "../../features/usersSlice";
import { addNewFriend, getAllFriends } from "../../features/friendsSlice";
import { Add } from "@mui/icons-material";
import type { User } from "../../models/User";
import FirstLetterAvatar from "../../components/FirstLetterAvatar";
import Logo from "../../components/nav/Logo";
import BackButton from "../../components/buttons/BackButton";
import AccauntNav from "../../components/nav/AccountNav";

const filterUsers = (users: User[] | null, currentUserId?: number, friends?: User[] | null) => {
    let filterUsers = users;
    if (!filterUsers) return [];
    
    const friendsIds = friends?.map((f) => f.id);
    filterUsers = filterUsers.filter(u => u.id != currentUserId && !friendsIds?.includes(u.id));
    return filterUsers;
};

const AddFriendPage = () => {
    const {users, user, loading, errorFetch} = useSelector((state: RootState) => state.users);
    const {friends} = useSelector((state: RootState) => state.friends);
    const friendsLoading = useSelector((state: RootState) => state.friends.loading);
    const dispatch = useDispatch<AppDispatch>();

    const filteredUsers = filterUsers(users, user?.id, friends);
    const noUsersToAdd = filteredUsers.length == 0;
    const pageInLoadingState = loading || friendsLoading;

    useEffect(() => {
        dispatch(getAllUsers())
    },[dispatch]);

    return (
        <>        
            <AppBar position="sticky"   sx={{color: 'black', backgroundColor: 'transparent',boxShadow: 'none'}}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2, alignItems: 'center'}}>
                    <Logo/>
                    <AccauntNav/>
                </Toolbar>
            </AppBar>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <BackButton page={"/friends"}/>
                {pageInLoadingState && <CircularProgress size={24} color="inherit" />}
                {errorFetch && (<Alert severity="error">{errorFetch}</Alert>)}
                {!pageInLoadingState && noUsersToAdd && <Alert severity="success">Looks like you are already friends with everybody!</Alert>}
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    {friends != null && filteredUsers?.map(user => {
                        const handleAddFriend = async () => {
                            await dispatch(addNewFriend({ friend_id: user.id }));
                            dispatch(getAllFriends()); 
                        };
                        return (
                            <ListItemButton key={user.id}>
                                <ListItemAvatar>
                                    <FirstLetterAvatar text={user?.username} />
                                </ListItemAvatar>
                                <ListItemText primary={user?.username} secondary={user?.email}/>
                                <IconButton onClick={() => handleAddFriend()} sx={{
                                    backgroundColor: 'primary.main', 
                                    '&:hover': {backgroundColor: 'primary.dark'},
                                    color: 'white',
                                    float: 'right'
                                }}>
                                    <Add/>
                                </IconButton>
                            </ListItemButton>
                        )
                    })}
                </List> 
            </Container>
        </>

    );
};

export default AddFriendPage;