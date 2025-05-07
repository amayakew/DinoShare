import { Container, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const HomePage = () => {
    const user = useSelector((state: RootState) => state.users.user);

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Typography variant="h4" textAlign="center">Hello, {user?.username}</Typography>
        </Container>
    );
};

export default HomePage;