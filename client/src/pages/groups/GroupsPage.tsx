import { 
    Card, 
    ListItem, 
    List, 
    Box, 
    ListItemAvatar, 
    ListItemText, 
    CircularProgress, 
    Alert, 
    IconButton,
    Typography
} from '@mui/material';
import { SettingsSuggest } from '@mui/icons-material';
import Navbar from '../../components/nav/Navbar';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState, AppDispatch } from '../../app/store';
import { getAllGroups } from '../../features/groupsSlice';
import FirstLetterAvatar from '../../components/FirstLetterAvatar';
import AddButtonToNewPage from '../../components/buttons/AddButtonToNewPage';

const GroupsPage = () => {
    const {groups, loading, error} = useSelector((state: RootState) => state.groups);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAllGroups())
    },[dispatch]);

    return (
        <>
            <Navbar/>
            <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5}}>
                <AddButtonToNewPage page={"/addgroup"}/>
                {groups?.length === 0 && <Alert severity="success" sx={{width: '60%'}}>Create your first group by clicking on '+' button</Alert>}
                {(groups?.length || 0) > 0 && <Card sx={{width: '60%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', mt: 2}}>
                    {loading && <CircularProgress size={24} color="inherit"/>}
                    {error && (<Alert severity="error">{error}</Alert>)}
                    <List sx={{ bgcolor: 'background.paper'}}>
                        {groups?.map(group => {
                            const needToPay = group.financeSummary.needToPay.map(payment => payment.price);
                            const sumOut = needToPay.reduce((acc, curr) => acc + curr, 0);
                            const needToReceive = group.financeSummary.needToReceive.map(receiving => receiving.price);
                            const sumIn = needToReceive.reduce((acc, curr) => acc + curr, 0);

                            return (
                                <ListItem key={group.id} sx={{display: 'flex', alignItems: 'center', padding: '8px 80px'}}>
                                    <ListItemAvatar>
                                        <FirstLetterAvatar text={group?.name} />
                                    </ListItemAvatar>
                                    <ListItemText primary={group?.name}/>
                                    <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                        {sumOut !== 0 && <Typography>You owe: {sumOut.toFixed(2)}</Typography>} 
                                        {sumIn !== 0 && <Typography>You are owed: {sumIn.toFixed(2)}</Typography>}
                                        {sumOut === 0 && sumIn === 0 && <Typography>Settled up</Typography>}
                                        <IconButton
                                            component={NavLink} to={`/groupdetails/${group.id}`}
                                            sx={{
                                                border: '1px solid',
                                                borderColor: 'transparent',
                                                color: 'primary.main',
                                                float: 'right',
                                                '&:hover': {color: 'primary.dark', border: '1px solid', borderColor: 'primary.main',}
                                            }}>
                                            <SettingsSuggest/>
                                        </IconButton>
                                    </Box>
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

export default GroupsPage;