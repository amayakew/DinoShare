import { Menu, MenuItem, ListItemIcon, Tooltip, IconButton} from "@mui/material";
import Logout from '@mui/icons-material/Logout';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../features/usersSlice";
import FirstLetterAvatar from "./FirstLetterAvatar";

const AccauntNav = () => {
    const user = useSelector((state: RootState) => state.users.user);
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <Tooltip title="Account settings">
                <IconButton
                    onClick={handleClick}
                    size="small"
                    sx={{ ml: 2 }}
                >
                    <FirstLetterAvatar text={user?.username} />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={() => dispatch(logout())}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </>
    );
};

export default AccauntNav;