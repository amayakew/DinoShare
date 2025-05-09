import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import AccauntNav from "./AccountNav";

const Navbar = () => {
    return (
        <AppBar position="sticky"   sx={{color: 'black', backgroundColor: 'transparent',boxShadow: 'none'}}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2, alignItems: 'center'}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img
                src="../../dinoLogo.png" // your logo file path
                alt="Logo"
                style={{ height: 50, marginRight: 8 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    DinoShare
                </Typography>
            </Box>
    
            {/* Links with active styling */}
            <Box sx={{position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 3}}>
              <Button 
                color="inherit" 
                component={NavLink} 
                to="/groups" 
                sx={{'&.active': { fontWeight: 'bold', textDecoration: 'underline' } }}
              >
                Groups
              </Button>
              <Button 
                color="inherit" 
                component={NavLink} 
                to="/friends" 
                sx={{ '&.active': { fontWeight: 'bold', textDecoration: 'underline' } }}
              >
                Friends
              </Button>
              {/* <Button 
                color="inherit" 
                component={NavLink} 
                to="/account" 
                sx={{ '&.active': { fontWeight: 'bold', textDecoration: 'underline' } }}
              >
                Account
              </Button> */}
            </Box>
            <AccauntNav/>
          </Toolbar>
        </AppBar>
    );
}

export default Navbar;