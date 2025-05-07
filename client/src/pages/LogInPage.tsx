import { Container, Box, Typography, TextField, Button, Link, Alert, CircularProgress } from "@mui/material";
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from 'react-router';
import type { AppDispatch, RootState } from '../app/store';
import { loginUser } from '../features/users/usersSlice';

const LogInPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);

    const loading = useSelector((state: RootState) => state.users.loading);
    const error = useSelector((state: RootState) => state.users.errorLogin);

    const dispatch = useDispatch<AppDispatch>();

    const handleLogin = async() => {
        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        };

        try {
            await dispatch(loginUser({ email, password })).unwrap();
            setSuccess(true);
        } catch (e) {
            setSuccess(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h4" textAlign="center">Log In</Typography>
                {error && (<Alert severity="error">{error}</Alert>)}
                {success && (
                    <Alert severity="success">
                        Logged In successful! Redirecting...
                    </Alert>
                )}
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
                <Button variant="contained" color="primary" disabled={loading} onClick={handleLogin}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                </Button>
                <Typography variant="body2" textAlign="center">
                    Don't have an account?{' '}
                    <Link component={RouterLink} to="/signup">Sign Up</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default LogInPage;