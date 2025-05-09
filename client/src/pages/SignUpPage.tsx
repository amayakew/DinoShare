import { Container, Box, Typography, TextField, Button, Link, Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router';
import type { AppDispatch, RootState } from '../app/store';
import { signupUser } from '../features/usersSlice';

const SignUpPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);

    const loading = useSelector((state: RootState) => state.users.loading);
    const error = useSelector((state: RootState) => state.users.errorSignup);

    const dispatch = useDispatch<AppDispatch>();

    const handleSignup = async() => {
        if (!username || !email || !password) {
            alert('Please fill in all fields');
            return;
        };

        try {
            await dispatch(signupUser({ email, username, password })).unwrap();
            setSuccess(true);
        } catch (e) {
            setSuccess(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" textAlign="center">Sign Up</Typography>
                {error && (<Alert severity="error">{error}</Alert>)}
                {success && (<Alert severity='success'>
                        Signed Up successfully! Please
                        <Link component={RouterLink} to="/login">Log In</Link>
                    </Alert>)}
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={loading}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                />
                <Button variant="contained" color="primary" disabled={loading} onClick={handleSignup}>
                    {loading ? <CircularProgress size={24} color="inherit"/> : 'Sign Up'}
                </Button>
                <Typography variant="body2" textAlign="center">
                    Already have an account?{' '}
                    <Link component={RouterLink} to="/login">Log In</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default SignUpPage;