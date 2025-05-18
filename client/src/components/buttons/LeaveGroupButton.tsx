import { IconButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useState } from "react";
import type { GroupExtended } from "../../models/GroupExtended";
import type { UserWithBalance } from "../../models/UserWithBalance";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";
import { leaveGroup } from "../../features/groupsSlice";

type LeaveGroupButtonProps = {
    userBalance: number | undefined;
    currentGroup: GroupExtended | undefined;
    currentUser: UserWithBalance | null;
};

const LeaveGroupButton = ({userBalance, currentGroup}: LeaveGroupButtonProps) => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const handleLeave = async () => {
        const result = await dispatch(leaveGroup({group_id: currentGroup?.id || 0}));

        if (leaveGroup.fulfilled.match(result)) {
            navigate('/groups');
        };
    }

    return (
        <>
            <IconButton onClick={handleOpen}>
                <Logout/>
            </IconButton>
            {userBalance !== 0 
                ? <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>
                        {"Error: "}
                    </DialogTitle>
                    <DialogContent>
                    <DialogContentText>
                        You can't leave this group till you pay all the debts
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
                : <Dialog
                    open={open}
                    onClose={handleClose}
                >
                    <DialogTitle>
                        {"Are you sure you want to leave this group? "}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={handleLeave}>
                            Yes
                        </Button>
                        <Button onClick={handleClose}>
                            No
                        </Button>
                    </DialogActions>
                </Dialog>
            }
      </>
    );
};

export default LeaveGroupButton;