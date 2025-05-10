import { Container, ListItemButton, List, ListItemAvatar, ListItemText, CircularProgress, Alert, IconButton} from '@mui/material';
import { Add } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from '../app/store';
import { getAllGroups } from '../features/groupsSlice';
import FirstLetterAvatar from '../components/FirstLetterAvatar';

const GroupsPage = () => {
    const {groups, loading, error} = useSelector((state: RootState) => state.groups);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllGroups())
    },[dispatch]);

    return (
        <>
            <Navbar/>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <IconButton component={NavLink} to="/addgroup" sx={{
                    backgroundColor: 'primary.main', 
                    '&:hover': {backgroundColor: 'primary.dark'},
                    color: 'white',
                    float: 'right'
                }}>
                    <Add/>
                </IconButton>
                {loading && <CircularProgress size={24} color="inherit"/>}
                {error && (<Alert severity="error">{error}</Alert>)}
                {groups?.length === 0 && <Alert severity="success">Create your first group by clicking on '+' button</Alert>}
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                    {groups?.map(group => {
                        return (
                            <ListItemButton key={group.id}>
                                <ListItemAvatar>
                                    <FirstLetterAvatar text={group?.name} />
                                </ListItemAvatar>
                                <ListItemText primary={group?.name}/>
                            </ListItemButton>
                        )
                    })}
                </List>
            </Container>
        </>
    );
};

export default GroupsPage;