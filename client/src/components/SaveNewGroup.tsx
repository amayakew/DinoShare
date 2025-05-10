import { Fragment } from "react";
import { CardContent, Typography, Box, Card, Stack, Chip, Avatar } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

type SaveNewGroupProps = {
    name: string;
    description: string;
    friendsIdsToAdd: number[];
};

const SaveNewGroup = ({name, description, friendsIdsToAdd}: SaveNewGroupProps) => {
    const {friends} = useSelector((state: RootState) => state.friends);
    const {user} = useSelector((state: RootState) => state.users);
    
    const filteredFriends = friends?.filter(f => friendsIdsToAdd.includes(f.id));

    const card = (
        <Fragment>
            <CardContent sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <Typography gutterBottom variant="h5" component="div">
                    {name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {description}
                </Typography>
                <Stack direction="row" spacing={1}>
                    {filteredFriends?.map(friend => <Chip avatar={<Avatar>{friend.username[0]}</Avatar>} label={friend.username}/>)}
                    <Chip avatar={<Avatar>{user?.username[0]}</Avatar>} label={user?.username}/>
                </Stack>
            </CardContent>
        </Fragment>
      );

    return (
        <Box sx={{ minWidth: '40%'}}>
            <Card variant="outlined">{card}</Card>
        </Box>
    );
};

export default SaveNewGroup;