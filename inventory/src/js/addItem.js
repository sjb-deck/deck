import React, { useState } from 'react';
import dayjs from 'dayjs';
import ReactDOM from 'react-dom/client';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {
  checkExpiryFormData,
  checkItemFormData,
  processExpirySubmission,
} from '../../../utils/submitForm';
import { processItemSubmission } from '../../../utils/submitForm';
import Theme from '../../../components/Themes';
import NavBar from '../../../components/NavBar/NavBar';
import SuccessDialog from '../../../components/AddItems/SuccessDialog';
import ItemPotentialMatchDialog from '../../../components/AddItems/ItemPotentialMatchDialog';
import AddItemForm from '../../../components/AddItems/AddItemForm';
import AddExpiryForm from '../../../components/AddItems/AddExpiryForm';
import TypeSelection from '../../../components/AddItems/TypeSelection';
import AddItemReview from '../../../components/AddItems/AddItemReview';
import AddExpiryReview from '../../../components/AddItems/AddExpiryReview';

export const user = JSON.parse(htmlDecode(userInfo))[0];
export const items = JSON.parse(htmlDecode(allItems));

const AddItem = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [addType, setAddType] = useState(''); // 'item' or 'expiry'
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [itemPotentialMatch, setItemPotentialMatch] = useState('');
  const [isItemPotentialMatchDialogOpen, setItemPotentialMatchDialogOpen] =
    useState(false);
  const [isSuccessDialogOpen, setSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const [itemFormData, setItemFormData] = useState({
    name: '',
    type: 'General',
    unit: '',
    image: '',
    total_quantityopen: 0,
    total_quantityunopened: 0,
    min_quantityopen: 0,
    min_quantityunopened: 0,
  });

  const [expiryFormData, setExpiryFormData] = useState({
    name: '',
    type: 'General',
    unit: '',
    image: '',
    expiry: [
      {
        date: dayjs(new Date()).format('YYYY-MM-DD'),
        total_quantityopen: 0,
        total_quantityunopened: 0,
      },
    ],
    min_quantityopen: 0,
    min_quantityunopened: 0,
  });

  const [itemFormError, setItemFormError] = useState({
    name: false,
    type: false,
    unit: false,
    image: false,
    total_quantityopen: false,
    total_quantityunopened: false,
    min_quantityopen: false,
    min_quantityunopened: false,
  });

  const [expiryFormError, setExpiryFormError] = useState({
    name: false,
    type: false,
    unit: false,
    image: false,
    expiry: [
      {
        date: false,
        total_quantityopen: false,
        total_quantityunopened: false,
      },
    ],
    min_quantityopen: false,
    min_quantityunopened: false,
  });

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
            items,
            setItemFormError,
            setItemPotentialMatch,
            setItemPotentialMatchDialogOpen,
          );
        } else if (addType === 'expiry') {
          checkExpiryFormData(
            expiryFormData,
            setActiveStep,
            items,
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

  const handleItemPotentialMatchDialogClose = () => {
    setItemPotentialMatchDialogOpen(false);
    setItemPotentialMatch('');
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleItemFormChange = (event) => {
    const { name, value } = event.target;
    setItemFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (name === 'total_quantityopen' || name === 'total_quantityunopened') {
      setItemFormError((prevFormError) => ({
        ...prevFormError,
        total_quantityopen: false,
        total_quantityunopened: false,
      }));
    }

    setItemFormError((prevFormError) => ({
      ...prevFormError,
      [name]: false,
    }));
  };

  const handleExpiryFormChange = (event) => {
    const { name, value } = event.target;
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
      <NavBar user={user} />
      <Box sx={{ maxWidth: 400, marginTop: 10 }}>
        <Stepper activeStep={activeStep} orientation='vertical'>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                {getStepContent(index)}
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
                    disabled={isNextDisabled}
                    size='small'
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
                <SuccessDialog
                  open={isSuccessDialogOpen}
                  onClose={handleSuccessDialogClose}
                  message={successMessage}
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
    </Theme>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<AddItem />);
