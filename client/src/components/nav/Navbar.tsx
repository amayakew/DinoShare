import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { NavLink } from "react-router-dom";
import AccauntNav from "./AccountNav";
import Logo from "./Logo";

const Navbar = () => {
    return (
        <AppBar position="sticky"   sx={{color: 'black', backgroundColor: 'transparent',boxShadow: 'none'}}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2, alignItems: 'center'}}>
            <Logo/>
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
            </Box>
            <AccauntNav/>
          </Toolbar>
        </AppBar>
    );
}

export default Navbar;