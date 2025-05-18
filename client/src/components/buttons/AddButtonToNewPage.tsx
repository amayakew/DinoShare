import { IconButton } from "@mui/material";
import { Add } from "@mui/icons-material";
import { NavLink } from "react-router-dom";

type AddButtonToNewPageProps = {
    page: string;
};

const AddButtonToNewPage = ({page}: AddButtonToNewPageProps) => {
    return (
        <IconButton 
            component={NavLink} to={page} 
            sx={{
                backgroundColor: 'primary.light', 
                '&:hover': {backgroundColor: 'primary.dark'},
                color: 'white',
                alignSelf: 'end',
                width: '40px',
                mr: 20
            }}>
            <Add/>
        </IconButton>
    );
};

export default AddButtonToNewPage;