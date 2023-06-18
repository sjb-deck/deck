import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Theme from '../../../components/Themes';
import NavBar from '../../../components/NavBar/NavBar';
import AddItemForm from '../../../components/AddItems/AddItemForm';
import AddExpiryForm from '../../../components/AddItems/AddExpiryForm';
import TypeSelection from '../../../components/AddItems/TypeSelection';

export const user = JSON.parse(htmlDecode(userInfo))[0];
export const items = JSON.parse(htmlDecode(allItems));

const PLACEHOLDER_IMAGE =
  'https://cdn4.buysellads.net/uu/1/127419/1670531697-AdobeTeams.jpg';

const AddItem = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [addType, setAddType] = useState(''); // 'item' or 'expiry'
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [itemFormData, setItemFormData] = useState({
    name: '',
    type: 'General',
    unit: '',
    image: PLACEHOLDER_IMAGE,
    total_quantityopen: 0,
    total_quantityunopened: 0,
    min_quantityopen: 0,
    min_quantityunopened: 0,
  });
  const [expiryFormData, setExpiryFormData] = useState({
    name: '',
    email: '',
    expiry: '',
  });

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleSubmitForm = (event) => {
  //   event.preventDefault();
  //   // Handle form submission logic here
  //   console.log(itemFormData);
  // };

  const handleItemFormChange = (event) => {
    const { name, value } = event.target;
    setItemFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleExpiryFormChange = (event) => {
    const { name, value } = event.target;
    setExpiryFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
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
            />
          );
        } else if (addType === 'expiry') {
          return (
            <AddExpiryForm
              expiryFormData={expiryFormData}
              handleFormChange={handleExpiryFormChange}
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
        return (
          <div>
            <Typography>Confirm Form Details:</Typography>
            <Typography>Add Type: {addType}</Typography>
            {addType === 'item' && (
              <div>
                <Typography>Name: {itemFormData.name}</Typography>
                <Typography>Name: {itemFormData.type}</Typography>
                <Typography>Name: {itemFormData.unit}</Typography>
                <Typography>Name: {itemFormData.image}</Typography>
                <Typography>Name: {itemFormData.total_quantityopen}</Typography>
                <Typography>
                  Name: {itemFormData.total_quantityunopened}
                </Typography>
                <Typography>Name: {itemFormData.min_quantityopen}</Typography>
                <Typography>
                  Name: {itemFormData.min_quantityunopened}
                </Typography>
              </div>
            )}
            {addType === 'expiry' && (
              <div>
                <Typography>
                  Expiry Date: {expiryFormData.expirydate}
                </Typography>
              </div>
            )}
          </div>
        );
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
