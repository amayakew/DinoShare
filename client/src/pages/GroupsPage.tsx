import { Container, Typography } from '@mui/material';
import Navbar from '../components/Navbar';

const GroupsPage = () => {
    return (
        <>
            <Navbar/>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" textAlign="center">Groups</Typography>
            </Container>
        </>
    );
};

export default GroupsPage;