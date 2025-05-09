import { Typography, Container } from "@mui/material";
import Navbar from "../components/Navbar";

const FriendsPage = () => {
    return (
        <>
            <Navbar/>
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Typography variant="h4" textAlign="center">Friends</Typography>
            </Container>
        </>
    );
};

export default FriendsPage;