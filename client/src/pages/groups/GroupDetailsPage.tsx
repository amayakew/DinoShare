import { 
    AppBar, 
    Box, 
    Toolbar, 
    Card, 
    CardContent, 
    Typography, 
    CardActions, 
    Button, 
    CardHeader, 
    Avatar, 
    IconButton, 
    Tooltip,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
    Modal
} from "@mui/material";
import Logo from "../../components/nav/Logo";
import { Delete } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import BackButton from "../../components/buttons/BackButton";
import FirstLetterAvatar from "../../components/FirstLetterAvatar";
import ExpensesDetailsForGroup from "../../components/expenses/ExpensesDetailsForGroup";
import AccauntNav from "../../components/nav/AccountNav";
import { deleteGroup, getAllGroups } from "../../features/groupsSlice";
import LeaveGroupButton from "../../components/buttons/LeaveGroupButton";

const GroupDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const {user} = useSelector((state: RootState) => state.users)
    const {groups, loading, error} = useSelector((state: RootState) => state.groups);
    const selectedGroup = groups?.find(group => group.id == Number(id));
    const groupBalance = selectedGroup?.financeSummary.groupBalance;
    const currentUserBalance = selectedGroup?.financeSummary.currentUserBalance;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [showError, setShowError] = useState<boolean>(false);

    useEffect(() => {
        dispatch(getAllGroups())
    },[dispatch]);

    const createGroupDate = selectedGroup?.created_at;
    const formattedDate: string = createGroupDate ? new Date(createGroupDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      : "Date not available";

    const [page, setPage] = useState('expenses');

    const members = 
        <List sx={{bgcolor: 'background.paper', display: 'flex', flexWrap: 'wrap', flexDirection: 'column', alignItems: 'center'}}>
            {selectedGroup?.members.map(member => {
                const color = member.balance >= 0 ? 'green' : 'red';
                return (
                    <ListItem key={member.id} sx={{width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid', borderColor: 'primary.main'}}>
                        <ListItemAvatar>
                            <FirstLetterAvatar text={member?.username} />
                        </ListItemAvatar>
                        <ListItemText primary={member?.username} secondary={member?.email}/>
                        <ListItemText
                            primary={member.balance.toFixed(2)}
                            slotProps={{primary: { style: { color: color } }}} // Set your desired color
                        />
                    </ListItem>
                )
            })}
        </List>

    const handleDelete = async () => {
        setShowError(false);
        const result = await dispatch(deleteGroup({group_id: selectedGroup?.id || 0}));

        if (deleteGroup.fulfilled.match(result)) {
            navigate('/groups');
        };
        if (deleteGroup.rejected.match(result)) {
            setShowError(true);
        }
    };

    return (
        <>
            <AppBar position="sticky"   sx={{color: 'black', backgroundColor: 'transparent',boxShadow: 'none'}}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2, alignItems: 'center'}}>
                    <Logo/>
                    <AccauntNav/>
                </Toolbar>
            </AppBar>
            <BackButton page={"/groups"}/>
            <Modal
                open={showError}
                onClose={() => setShowError(false)}    
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '25%',
                        bgcolor: 'primary.light',
                        border: '1px solid',
                        borderColor: 'primary.dark',
                        boxShadow: 24,
                        p: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 5,
                        alignItems: 'center'
                    }}
                >
                        <Typography>{error}</Typography>
                        <Button
                            onClick={() => setShowError(false)}
                            sx={{
                                backgroundColor: 'primary.main',
                                color: 'black',
                                width: '30%',
                                alignSelf: 'center'
                            }}
                        >
                            OK
                        </Button>
                </Box>
            </Modal>
            {loading && <CircularProgress size={24} color="inherit" />}
            {!loading && <Card sx={{ maxWidth: '70%', maxHeight: '80vh', display: 'flex', flexDirection: 'column', margin: '0 auto' }}>
                <CardHeader
                    avatar={
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {selectedGroup?.name[0]}
                        </Avatar>
                    }
                    action={
                        <Box>
                            {user?.id != selectedGroup?.owner_id && (
                                    <Tooltip title="Leave Group">
                                        <LeaveGroupButton userBalance = {currentUserBalance} currentGroup = {selectedGroup} currentUser = {user}/>
                                    </Tooltip>
                                )
                            }
                            {user?.id == selectedGroup?.owner_id && (
                                    <Tooltip title="Delete Group">
                                        <IconButton onClick={handleDelete}>
                                            <Delete/>
                                        </IconButton>
                                    </Tooltip>
                                )
                            }
                        </Box>
                    }
                    title={selectedGroup?.name}
                    subheader={`Created by ${selectedGroup?.owner.username} on ${formattedDate}`}
                />
                <CardContent sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {selectedGroup?.description}
                        </Typography>
                    </Box>
                </CardContent>
                <Box sx={{alignSelf: 'center', display: 'flex', gap: 2}}>
                            <Typography>
                                <strong>Group Balance:</strong> <span style={{color: (groupBalance || 0) >= 0 ? 'green' : 'red'}}>{groupBalance?.toFixed(2)}</span>
                            </Typography>
                            <Typography>
                                <strong>{(currentUserBalance || 0) >= 0 ? "You're owed: " : "You owe: "}</strong> <span style={{color: (currentUserBalance || 0) >= 0 ? 'green' : 'red'}}>{currentUserBalance?.toFixed(2)}</span>
                            </Typography>
                </Box>
                <CardActions sx={{alignSelf: 'center'}}>
                    <Button sx={{ fontWeight: page === 'expenses' ? 'bold' : 'normal' }} size="small"  onClick={() => setPage('expenses')}>Expenses</Button>
                    <Button sx={{ fontWeight: page === 'members' ? 'bold' : 'normal' }} size="small" onClick={() => setPage('members')}>Members</Button>
                </CardActions>
                <CardContent>
                    {page === 'expenses' ? <ExpensesDetailsForGroup/> : members}
                </CardContent>
            </Card>}
        </>
    );
};

export default GroupDetailsPage;
