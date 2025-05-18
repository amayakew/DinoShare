import { Box, Stepper, Step, StepLabel, Button, Typography, CircularProgress, Card } from '@mui/material';
import { useEffect, useState } from 'react';
import AddGroupDetails from './AddGroupDetails';
import AddGroupMembers from './AddGroupMembers';
import SaveNewGroup from './SaveNewGroup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGroupAddMembers } from '../../features/groupsSlice';
import type { AppDispatch, RootState } from '../../app/store';

const steps = ['Add Group Details', 'Add Members', 'Create Group'];

const CreateGroupStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);
  const [friendsIdsToAdd, setFriendsIdsToAdd] = useState<number[]>([]);

  const {loading} = useSelector((state: RootState) => state.groups);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleClick = async() => {
    if (activeStep != 2) {
       setActiveStep((prev) => prev + 1); 
    } else {
        const result = await dispatch(createGroupAddMembers({ name, description, members_ids: friendsIdsToAdd}));

        if (createGroupAddMembers.fulfilled.match(result)) {
          navigate('/groups');
        };
    };
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    if (activeStep == 0) {
        if (name && description) {
            setNextButtonEnabled(true);
        }
        else {
            setNextButtonEnabled(false);
        }
    }
    else if (activeStep == 1) 
    {
        if (friendsIdsToAdd.length > 0) {
            setNextButtonEnabled(true);
        }
        else {
            setNextButtonEnabled(false);
        }
    }
  }, [name, description, activeStep, friendsIdsToAdd]);

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return <AddGroupDetails name={name} setName={setName} description={description} setDescription={setDescription}/>;
      case 1:
        return <AddGroupMembers friendsIdsToAdd={friendsIdsToAdd} setFriendsIdsToAdd={setFriendsIdsToAdd}/>;
      case 2:
        return <SaveNewGroup name={name} description={description} friendsIdsToAdd={friendsIdsToAdd}/>;
      default:
        return null;
    }
  };

  return (
    <Card sx={{ width: '80%', padding: '30px' }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ mt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {activeStep === steps.length ? (
          <>
            <Typography>All steps completed - you're finished</Typography>
            <Button onClick={handleReset} sx={{ mt: 2 }}>Reset</Button>
          </>
        ) : (
          <>
            {renderStepContent(activeStep)}
            <Button disabled={loading || !nextButtonEnabled} variant="contained" color="primary" sx={{mt: 2, width: '10%'}} onClick={handleClick}>
              {loading ? <CircularProgress size={24} color="inherit" /> : activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </>
        )}
      </Box>
    </Card>
  );
};

export default CreateGroupStepper;