import { IconButton } from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

type BackButtonProps = {
    page: string;
};

const BackButton = ({page}: BackButtonProps) => {
    return (
        <IconButton
            component={NavLink} to={page} 
            sx={{
                width: '40px',
                height: '40px',
                backgroundColor: 'primary.main', 
                '&:hover': {backgroundColor: 'primary.dark'},
                color: 'white'
            }}>
                <ArrowBackIosNew/>
        </IconButton>
    );
};

export default BackButton;