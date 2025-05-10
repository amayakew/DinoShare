import { Container, List, ListItemButton, ListItemAvatar, ListItemText, IconButton, CircularProgress, Alert } from "@mui/material";
import { Add, Done } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { useEffect } from "react";
import { getAllFriends } from "../features/friendsSlice.js";
import FirstLetterAvatar from "./FirstLetterAvatar.js";


type AddGroupMembersProps = {
    friendsIdsToAdd: number[],
    setFriendsIdsToAdd: React.Dispatch<React.SetStateAction<number[]>>
};

const AddGroupMembers = ({friendsIdsToAdd, setFriendsIdsToAdd}: AddGroupMembersProps) => {
    const {friends, loading, error} = useSelector((state: RootState) => state.friends);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllFriends());
    }, [dispatch]);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {loading && <CircularProgress size={24} color="inherit" />}
            {error && (<Alert severity="error">{error}</Alert>)}
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                {friends?.map(user => {
                    const userIsAdded = friendsIdsToAdd.includes(user.id);
                    const handleClick = async () => {
                        if (userIsAdded) {
                            setFriendsIdsToAdd(friendsIdsToAdd.filter(id => id != user.id));
                        } else {
                          setFriendsIdsToAdd([...friendsIdsToAdd, user.id]);  
                        }; 
                    };
                    return (
                        <ListItemButton key={user.id}>
                            <ListItemAvatar>
                                <FirstLetterAvatar text={user?.username} />
                            </ListItemAvatar>
                            <ListItemText primary={user?.username} secondary={user?.email}/>
                            <IconButton sx={{
                                backgroundColor: 'primary.main', 
                                '&:hover': {backgroundColor: 'primary.dark'},
                                color: 'white',
                                float: 'right'
                                }}
                                onClick={handleClick}
                            >
                                {!userIsAdded ? <Add/> : <Done/>}
                            </IconButton>
                        </ListItemButton>
                    )
                })}
            </List> 
        </Container>
    );
};

export default AddGroupMembers;