import { Box, Typography } from "@mui/material";

const Logo = () => {
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                src="../../dinoLogo.png"
                alt="Logo"
                style={{ height: 50, marginRight: 8 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    DinoShare
                </Typography>
            </Box>
        </>
    );
};

export default Logo;