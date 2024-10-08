import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useContext, useEffect, useState } from 'react';
import { getUser } from '../hooks/auth/authHook';

import {
  AddExpiryForm,
  AddExpiryReview,
  AddItemForm,
  AddItemReview,
  Footer,
  ItemPotentialMatchDialog,
  NavBar,
  SnackBarAlerts,
  Theme,
  TypeSelection,
} from '../components';
import { useAddItem } from '../hooks/mutations';
import { useItems } from '../hooks/queries';
import { AlertContext } from '../providers';
import {
  checkExpiryFormData,
  checkItemFormData,
  processImageFile,
} from '../utils';

export const AddItem = () => {
  const { data: items, isLoading: dataLoading, error: dataError } = useItems();
  const userData = getUser();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [itemsData, setItems] = useState(items);
  const [activeStep, setActiveStep] = useState(0);
  const [addType, setAddType] = useState(''); // 'item' or 'expiry'
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [itemPotentialMatch, setItemPotentialMatch] = useState('');
  const [isItemPotentialMatchDialogOpen, setItemPotentialMatchDialogOpen] =
    useState(false);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const { mutate } = useAddItem();
  const { setAlert } = useContext(AlertContext);

  const [itemFormData, setItemFormData] = useState({
    name: '',
    type: 'General',
    unit: '',
    imgpic: {},
    total_quantity: 0,
    min_quantity: 0,
    is_opened: false,
  });

  const [expiryFormData, setExpiryFormData] = useState({
    name: '',
    type: 'General',
    unit: '',
    imgpic: {},
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

  const processItemSubmission = async () => {
    setLoading(true);
    const payload = {
      name: itemFormData.name,
      type: itemFormData.type,
      unit: itemFormData.unit,
      imgpic: await processImageFile(itemFormData.imgpic, itemFormData.name),
      total_quantity: itemFormData.total_quantity,
      min_quantity: itemFormData.min_quantity,
      is_opened: itemFormData.is_opened,
      expiry_dates: [
        {
          expiry_date: null,
          quantity: itemFormData.total_quantity,
          archived: false,
        },
      ],
    };
    mutate(payload, {
      onSuccess: () => {
        setActiveStep(0);
        setAddType('');
        setItemFormData({
          name: '',
          type: 'General',
          unit: '',
          imgpic: {},
          total_quantity: 0,
          min_quantity: 0,
          is_opened: false,
        });
        setAlert({
          severity: 'success',
          message: 'Successfully added new item!',
          autoHide: true,
        });
        setLoading(false);
      },
      onError: (error) => {
        setActiveStep(0);
        setAddType('');
        setItemFormData({
          name: '',
          type: 'General',
          unit: '',
          imgpic: {},
          total_quantity: 0,
          min_quantity: 0,
          is_opened: false,
        });
        setAlert({
          severity: 'error',
          message: error.message,
          autoHide: true,
          additionalInfo: error.response?.data?.message,
        });
        setLoading(false);
      },
    });
  };

  const processExpirySubmission = async () => {
    setLoading(true);
    const modifiedExpiry = expiryFormData.expiry.map((item) => ({
      expiry_date: item.expiry_date,
      quantity: item.quantity,
      archived: false,
    }));

    const totalQuantity = modifiedExpiry.reduce(
      (total, item) => total + item.quantity,
      0,
    );

    const payload = {
      name: expiryFormData.name,
      type: expiryFormData.type,
      unit: expiryFormData.unit,
      imgpic: await processImageFile(
        expiryFormData.imgpic,
        expiryFormData.name,
      ),
      total_quantity: totalQuantity,
      min_quantity: expiryFormData.min_quantity,
      is_opened: expiryFormData.is_opened,
      expiry_dates: modifiedExpiry,
    };
    mutate(payload, {
      onSuccess: () => {
        setActiveStep(0);
        setAddType('');
        setExpiryFormData({
          name: '',
          type: 'General',
          unit: '',
          imgpic: {},
          expiry: [
            {
              expiry_date: dayjs(new Date()).format('YYYY-MM-DD'),
              quantity: 0,
            },
          ],
          min_quantity: 0,
          is_opened: false,
        });

        setExpiryFormError({
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
        setAlert({
          severity: 'success',
          message: 'Successfully added new item!',
          autoHide: true,
        });
        setLoading(false);
        queryClient.invalidateQueries('items');
      },
      onError: (error) => {
        setActiveStep(0);
        setAddType('');
        setExpiryFormData({
          name: '',
          type: 'General',
          unit: '',
          imgpic: {},
          expiry: [
            {
              expiry_date: dayjs(new Date()).format('YYYY-MM-DD'),
              quantity: 0,
            },
          ],
          min_quantity: 0,
          is_opened: false,
        });

        setExpiryFormError({
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
        setAlert({
          severity: 'error',
          message: error.message,
          additionalInfo: error.response?.data?.message,
        });
        setLoading(false);
      },
    });
  };

  useEffect(() => {
    if (dataError) {
      setSnackbarOpen(true);
    }
    if (!dataLoading && !dataError) {
      setItems(items);
    }
  }, [dataLoading, dataError, items]);

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
          processItemSubmission();
        } else if (addType === 'expiry') {
          processExpirySubmission();
        }
        return;
      default:
        return;
    }
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

    if (name === 'imgpic') {
      value = event.target.files[0];
    }

    if (name === 'imgPreview') {
      value = event.target.value;
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

    if (name === 'imgpic') {
      value = event.target.files[0];
    }

    if (name === 'imgPreview') {
      value = event.target.value;
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
      <SnackBarAlerts open={snackbarOpen} message={dataError?.message} />
      <NavBar user={userData} />
      <div style={{ minHeight: '100vh' }}>
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
      <Footer />
    </Theme>
  );
};
