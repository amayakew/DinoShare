import { AppBar, Toolbar, Box} from "@mui/material";
import CreateGroupStepper from "../../components/groups/CreateGroupStepper";
import Logo from "../../components/nav/Logo";
import BackButton from "../../components/buttons/BackButton";
import AccauntNav from "../../components/nav/AccountNav";

const CreateGroupPage = () => {
    return (
        <>
            <AppBar position="sticky"   sx={{color: 'black', backgroundColor: 'transparent',boxShadow: 'none'}}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2, alignItems: 'center'}}>
                    <Logo/>
                    <AccauntNav/>
                </Toolbar>
            </AppBar>
            <Box sx={{display: 'flex', justifyContent: 'center', gap: 2, padding: '30px'}}>
                <BackButton page={"/groups"}/>
                <CreateGroupStepper/>
            </Box>
        </>
    );
};

export default CreateGroupPage;