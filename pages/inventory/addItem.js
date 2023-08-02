import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';

import {
  AddExpiryForm,
  AddExpiryReview,
  AddItemForm,
  AddItemReview,
  ErrorDialog,
  ItemPotentialMatchDialog,
  NavBar,
  SnackBarAlerts,
  SuccessDialog,
  Theme,
  TypeSelection,
} from '../../components';
import { useItems, useUser } from '../../hooks/queries';
import {
  checkExpiryFormData,
  checkItemFormData,
  processExpirySubmission,
  processItemSubmission,
} from '../../utils/submitForm';

const AddItem = () => {
  const { data: items, isLoading: dataLoading, error: dataError } = useItems();
  const { data: user, isLoading: userLoading, error: userError } = useUser();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [itemsData, setItems] = useState(items);
  const [userData, setUser] = useState(user);
  const [activeStep, setActiveStep] = useState(0);
  const [addType, setAddType] = useState(''); // 'item' or 'expiry'
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [itemPotentialMatch, setItemPotentialMatch] = useState('');
  const [isItemPotentialMatchDialogOpen, setItemPotentialMatchDialogOpen] =
    useState(false);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [isErrorDialogOpen, setErrorDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [itemFormData, setItemFormData] = useState({
    name: '',
    type: 'General',
    unit: '',
    imgpic: '',
    total_quantity: 0,
    min_quantity: 0,
    is_opened: false,
  });

  const [expiryFormData, setExpiryFormData] = useState({
    name: '',
    type: 'General',
    unit: '',
    imgpic: '',
    expiry: [
      {
        expiry_date: dayjs(new Date()).format('YYYY-MM-DD'),
        quantity: 0,
      },
    ],
    min_quantity: 0,
    is_opened: false,
  });

  const [itemFormError, setItemFormError] = useState({
    name: false,
    type: false,
    unit: false,
    imgpic: false,
    total_quantity: false,
    min_quantity: false,
    is_opened: false,
  });

  const [expiryFormError, setExpiryFormError] = useState({
    name: false,
    type: false,
    unit: false,
    imgpic: false,
    expiry: [
      {
        expiry_date: false,
        quantity: false,
      },
    ],
    min_quantity: false,
    is_opened: false,
  });

  useEffect(() => {
    if (dataError || userError) {
      setSnackbarOpen(true);
    }
    if (!dataLoading && !dataError) {
      setItems(items);
    }
    if (!userLoading && !userError) {
      setUser(user);
    }
  }, [dataLoading, userLoading, dataError, userError, items, user]);

  const handleNext = () => {
    switch (activeStep) {
      case 0:
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        return;
      case 1:
        if (addType === 'item') {
          checkItemFormData(
            itemFormData,
            setActiveStep,
            itemsData,
            setItemFormError,
            setItemPotentialMatch,
            setItemPotentialMatchDialogOpen,
          );
        } else if (addType === 'expiry') {
          checkExpiryFormData(
            expiryFormData,
            setActiveStep,
            itemsData,
            setExpiryFormError,
            setItemPotentialMatch,
            setItemPotentialMatchDialogOpen,
          );
        }
        return;
      case 2:
        if (addType === 'item') {
          processItemSubmission(
            itemFormData,
            setActiveStep,
            setItemFormData,
            setAddType,
            setSuccessDialogOpen,
            setSuccessMessage,
            setErrorDialogOpen,
            setLoading,
          );
        } else if (addType === 'expiry') {
          processExpirySubmission(
            expiryFormData,
            setActiveStep,
            setExpiryFormData,
            setExpiryFormError,
            setAddType,
            setSuccessDialogOpen,
            setSuccessMessage,
            setErrorDialogOpen,
            setLoading,
          );
        }
        return;
      default:
        return;
    }
  };

  const handleSuccessDialogClose = () => {
    setSuccessDialogOpen(false);
    setSuccessMessage('');
  };

  const handleErrorDialogClose = () => {
    setErrorDialogOpen(false);
  };

  const handleItemPotentialMatchDialogClose = () => {
    setItemPotentialMatchDialogOpen(false);
    setItemPotentialMatch('');
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleItemFormChange = (event) => {
    let { name, value } = event.target;

    if (name === 'is_opened') {
      value = !itemFormData.is_opened;
    }

    setItemFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setItemFormError((prevFormError) => ({
      ...prevFormError,
      [name]: false,
    }));
  };

  const handleExpiryFormChange = (event) => {
    let { name, value } = event.target;

    if (name === 'is_opened') {
      value = !expiryFormData.is_opened;
    }

    setExpiryFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    setExpiryFormError((prevFormError) => ({
      ...prevFormError,
      [name]: false,
    }));
  };

  const handleAddTypeSelection = (type) => {
    setAddType(type);
    setIsNextDisabled(false);
  };

  const steps = ['Step 1', 'Step 2', 'Step 3'];

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <TypeSelection
            addType={addType}
            handleAddTypeSelection={handleAddTypeSelection}
          />
        );
      case 1:
        if (addType === 'item') {
          return (
            <AddItemForm
              itemFormData={itemFormData}
              handleFormChange={handleItemFormChange}
              itemFormError={itemFormError}
            />
          );
        } else if (addType === 'expiry') {
          return (
            <AddExpiryForm
              expiryFormData={expiryFormData}
              handleFormChange={handleExpiryFormChange}
              expiryFormError={expiryFormError}
              setExpiryFormData={setExpiryFormData}
              setExpiryFormError={setExpiryFormError}
            />
          );
        } else {
          return (
            <Typography>
              Please go back to the previous step and choose an add type.
            </Typography>
          );
        }
      case 2:
        if (addType === 'item') {
          return <AddItemReview itemFormData={itemFormData} />;
        } else if (addType === 'expiry') {
          return <AddExpiryReview expiryFormData={expiryFormData} />;
        } else {
          return (
            <Typography>
              Please go back to step 1 and choose an add type.
            </Typography>
          );
        }
      default:
        return null;
    }
  };

  return (
    <Theme>
      <SnackBarAlerts
        open={snackbarOpen}
        message={dataError?.message || userError?.message}
      />
      <NavBar user={userData} />
      <div style={{ overflowY: 'auto', maxHeight: '90vh' }}>
        <Box
          sx={{ maxWidth: 400, marginTop: 12, marginLeft: 4, marginRight: 4 }}
        >
          <Stepper activeStep={activeStep} orientation='vertical'>
            {steps.map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
                <StepContent>
                  <div>{getStepContent(index)}</div>
                  <div style={{ marginTop: 10 }}>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      size='small'
                    >
                      Back
                    </Button>
                    <Button
                      variant='contained'
                      color='primary'
                      onClick={handleNext}
                      disabled={isNextDisabled || loading}
                      size='small'
                    >
                      {activeStep === steps.length - 1 ? 'Confirm' : 'Next'}
                    </Button>
                    <div style={{ marginTop: '10px', marginRight: '30px' }}>
                      {loading ? <LinearProgress /> : null}
                    </div>
                  </div>
                  <SuccessDialog
                    open={isSuccessDialogOpen}
                    onClose={handleSuccessDialogClose}
                    message={successMessage}
                  />
                  <ErrorDialog
                    open={isErrorDialogOpen}
                    onClose={handleErrorDialogClose}
                  />
                  <ItemPotentialMatchDialog
                    open={isItemPotentialMatchDialogOpen}
                    onClose={handleItemPotentialMatchDialogClose}
                    match={itemPotentialMatch}
                    setActiveStep={setActiveStep}
                  />
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </div>
    </Theme>
  );
};

export default AddItem;
