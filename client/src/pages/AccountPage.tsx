import { Typography, Container } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store"; 
import Navbar from "../components/Navbar";

const AccountPage = () => {
    const user = useSelector((state: RootState) => state.users.user);

    return (
        <>
            <Navbar/>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" textAlign="center">{user?.username}'s profile</Typography>
            </Container>
        </>
    );
};

export default AccountPage;