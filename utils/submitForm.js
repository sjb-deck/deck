import axios from 'axios';
import dayjs from 'dayjs';

import { INV_API_EXPIRY_POST_URL } from '../globals';

import findPotentialMatch from './levenshteinDistance';

const PLACEHOLDER_IMAGE =
  'https://cdn4.buysellads.net/uu/1/127419/1670531697-AdobeTeams.jpg';

// Normalised Levenshtein distance threshold
const LEVENSHTEIN_THRESHOLD = 0.2;

const isValidInt = (value) => {
  return Number.isInteger(value) && value >= 0 && value <= 1000;
};

/**
 * Checks if there are no errors in the expiryErrorArray.
 *
 * @param {Array} expiryErrorArray - The array containing error flags for each expiry.
 * @return {boolean} - True if there are no errors, false otherwise.
 */
function isNoErrorInArray(expiryErrorArray) {
  for (let i = 0; i < expiryErrorArray.length; i++) {
    if (
      expiryErrorArray[i].total_quantity ||
      expiryErrorArray[i].expiry_date
    ) {
      return false;
    }
  }
  return true;
}

/**
 * Checks if there are no errors in the tempExpiryFormError object and its nested arrays.
 *
 * @param {Object} tempExpiryFormError - The error object containing form validation errors.
 * @return {boolean} - True if there are no errors, false otherwise.
 */
function isAllNoError(tempExpiryFormError) {
  return (
    !tempExpiryFormError.name &&
    !tempExpiryFormError.type &&
    !tempExpiryFormError.unit &&
    !tempExpiryFormError.image &&
    !tempExpiryFormError.min_quantity &&
    isNoErrorInArray(tempExpiryFormError.expiry)
  );
}

const checkExpiryFormData = (
  expiryFormData,
  setActiveStep,
  items,
  setExpiryFormError,
  setItemPotentialMatch,
  setItemPotentialMatchDialogOpen,
) => {
  const tempExpiryFormError = {
    name: false,
    type: false,
    unit: false,
    image: false,
    expiry: expiryFormData.expiry.map((item, index, array) => ({
      expiry_date:
        array.findIndex((elem, i) => elem.expiry_date === item.expiry_date && i !== index) !==
        -1,
      quantity: false,
    })),
    min_quantity: false,
    is_opened: false,
  };

  // for (let i = 0; i < expiryFormData.expiry.length; i++) {
  //   tempExpiryFormError.expiry.push({
  //     expiry_date: false,
  //     quantity: false,
  //   });
  // }

  for (let i = 0; i < expiryFormData.expiry.length; i++) {
    try {
      expiryFormData.expiry[i].quantity = parseInt(
        expiryFormData.expiry[i].quantity,
      );
    } catch {
      tempExpiryFormError.expiry[i].quantity = true;
    }
  }


  try {
    expiryFormData.min_quantity = parseInt(expiryFormData.min_quantity);
  } catch {
    tempExpiryFormError.min_quantity = true;
  }

  if (expiryFormData.name === '') {
    tempExpiryFormError.name = true;
  }

  if (expiryFormData.unit === '') {
    tempExpiryFormError.unit = true;
  }

  if (
    isNoErrorInArray(tempExpiryFormError.expiry) &&
    !tempExpiryFormError.min_quantity
  ) {
    for (let i = 0; i < expiryFormData.expiry.length; i++) {
      if (!isValidInt(expiryFormData.expiry[i].quantity)) {
        tempExpiryFormError.expiry[i].quantity = true;
      }
      if (
        expiryFormData.expiry[i].quantity <= 0
      ) {
        tempExpiryFormError.expiry[i].quantity = true;
      }
      if (
        expiryFormData.expiry[i].expiry_date === null ||
        expiryFormData.expiry[i].expiry_date === dayjs(new Date()).format('YYYY-MM-DD')
      ) {
        tempExpiryFormError.expiry[i].expiry_date = true;
      }
    }

    if (!isValidInt(expiryFormData.min_quantity)) {
      tempExpiryFormError.min_quantity = true;
    }
  }

  if (!isAllNoError(tempExpiryFormError)) {
    setExpiryFormError(tempExpiryFormError);
    return;
  }
  const potentialMatch = findPotentialMatch(
    expiryFormData.name,
    items,
    LEVENSHTEIN_THRESHOLD,
  );
  if (potentialMatch !== null) {
    setItemPotentialMatch(potentialMatch);
    setItemPotentialMatchDialogOpen(true);
  }
  if (expiryFormData.image === '') {
    expiryFormData.image = PLACEHOLDER_IMAGE;
  }
  setActiveStep((prevActiveStep) => prevActiveStep + 1);
};

const checkItemFormData = (
  itemFormData,
  setActiveStep,
  items,
  setItemFormError,
  setItemPotentialMatch,
  setItemPotentialMatchDialogOpen,
) => {
  const tempItemFormError = {
    name: false,
    type: false,
    unit: false,
    image: false,
    total_quantity: false,
    min_quantity: false,
    is_opened: false,
  };

  try {
    itemFormData.total_quantity = parseInt(itemFormData.total_quantity);
  } catch {
    tempItemFormError.total_quantity = true;
  }

  try {
    itemFormData.min_quantityopen = parseInt(itemFormData.min_quantity);
  } catch {
    tempItemFormError.min_quantity = true;
  }

  if (itemFormData.name === '') {
    tempItemFormError.name = true;
  }

  if (itemFormData.unit === '') {
    tempItemFormError.unit = true;
  }

  if (
    !tempItemFormError.total_quantity &&
    !tempItemFormError.min_quantity
  ) {
    if (!isValidInt(itemFormData.total_quantity)) {
      tempItemFormError.total_quantity = true;
    }
    if (
      itemFormData.total_quantity <= 0
    ) {
      tempItemFormError.total_quantity = true;
    }
    if (!isValidInt(itemFormData.min_quantity)) {
      tempItemFormError.min_quantity = true;
    }
  }

  if (Object.values(tempItemFormError).some((value) => value === true)) {
    setItemFormError(tempItemFormError);
    return;
  }

  const potentialMatch = findPotentialMatch(
    itemFormData.name,
    items,
    LEVENSHTEIN_THRESHOLD,
  );
  if (potentialMatch !== null) {
    setItemPotentialMatch(potentialMatch);
    setItemPotentialMatchDialogOpen(true);
  }
  if (itemFormData.image === '') {
    itemFormData.image = PLACEHOLDER_IMAGE;
  }
  setActiveStep((prevActiveStep) => prevActiveStep + 1);
};

const processItemSubmission = (
  itemFormData,
  setActiveStep,
  setItemFormData,
  setAddType,
  setSuccessDialogOpen,
  setSuccessMessage,
  setErrorDialogOpen,
  setLoading,
) => {
  // setLoading(true);
  const payload = {
    name: itemFormData.name,
    type: itemFormData.type,
    unit: itemFormData.unit,
    imgpic: itemFormData.imgpic,
    total_quantity: itemFormData.total_quantity,
    min_quantity: itemFormData.min_quantity,
    is_opened: itemFormData.is_opened,
    expiry_dates: [
      {
        expiry_date: '',
        quantity: itemFormData.total_quantity,
        archived: false
      },
    ]
  }
  console.log(payload)
    // .then((response) => {
    //   setSuccessMessage(
    //     `${itemFormData.name} added successfully to the ${itemFormData.type} category!`,
    //   );
    //   setActiveStep(0);
    //   setAddType('');
    //   setItemFormData({
    //     name: '',
    //     type: 'General',
    //     unit: '',
    //     image: '',
    //     total_quantityopen: 0,
    //     total_quantityunopened: 0,
    //     min_quantityopen: 0,
    //     min_quantityunopened: 0,
    //   });
    //   setLoading(false);
    //   setSuccessDialogOpen(true);
    //   console.log(response.data);
    // })
    // .catch((error) => {
    //   setActiveStep(0);
    //   setAddType('');
    //   setItemFormData({
    //     name: '',
    //     type: 'General',
    //     unit: '',
    //     image: '',
    //     total_quantityopen: 0,
    //     total_quantityunopened: 0,
    //     min_quantityopen: 0,
    //     min_quantityunopened: 0,
    //   });
    //   setLoading(false);
    //   setErrorDialogOpen(true);
    //   console.error(error);
    // });
};

const processExpirySubmission = (
  expiryFormData,
  setActiveStep,
  setExpiryFormData,
  setExpiryFormError,
  setAddType,
  setSuccessDialogOpen,
  setSuccessMessage,
  setErrorDialogOpen,
  setLoading,
) => {
  // setLoading(true);
  const modifiedExpiry = expiryFormData.expiry.map((item) => ({
    expiry_date: item.expiry_date,
    quantity: item.quantity,
    archived: false,
  }));

  const total_quantity = modifiedExpiry.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const payload = {
    name: expiryFormData.name,
    type: expiryFormData.type,
    unit: expiryFormData.unit,
    imgpic: expiryFormData.imgpic,
    total_quantity: total_quantity,
    min_quantity: expiryFormData.min_quantity,
    is_opened: expiryFormData.is_opened,
    expiry_dates: modifiedExpiry,
  };
  console.log(payload)
    // .then((response) => {
    //   setSuccessMessage(
    //     `${expiryFormData.name} added successfully - with expiry date(s) - to the ${expiryFormData.type} category!`,
    //   );
    //   setActiveStep(0);
    //   setAddType('');
    //   setExpiryFormData({
    //     name: '',
    //     type: 'General',
    //     unit: '',
    //     image: '',
    //     expiry: [
    //       {
    //         item: 0,
    //         date: dayjs(new Date()).format('YYYY-MM-DD'),
    //         total_quantityopen: 0,
    //         total_quantityunopened: 0,
    //       },
    //     ],
    //     min_quantityopen: 0,
    //     min_quantityunopened: 0,
    //   });
    //
    //   setExpiryFormError({
    //     name: false,
    //     type: false,
    //     unit: false,
    //     image: false,
    //     expiry: [
    //       {
    //         date: false,
    //         total_quantityopen: false,
    //         total_quantityunopened: false,
    //       },
    //     ],
    //     min_quantityopen: false,
    //     min_quantityunopened: false,
    //   });
    //   setLoading(false);
    //   setSuccessDialogOpen(true);
    //   console.log(response.data);
    // })
    // .catch((error) => {
    //   setActiveStep(0);
    //   setAddType('');
    //   setExpiryFormData({
    //     name: '',
    //     type: 'General',
    //     unit: '',
    //     image: '',
    //     expiry: [
    //       {
    //         item: 0,
    //         date: dayjs(new Date()).format('YYYY-MM-DD'),
    //         total_quantityopen: 0,
    //         total_quantityunopened: 0,
    //       },
    //     ],
    //     min_quantityopen: 0,
    //     min_quantityunopened: 0,
    //   });
    //
    //   setExpiryFormError({
    //     name: false,
    //     type: false,
    //     unit: false,
    //     image: false,
    //     expiry: [
    //       {
    //         date: false,
    //         total_quantityopen: false,
    //         total_quantityunopened: false,
    //       },
    //     ],
    //     min_quantityopen: false,
    //     min_quantityunopened: false,
    //   });
    //   setLoading(false);
    //   setErrorDialogOpen(true);
    //   console.error(error);
    // });
};

export {
  checkItemFormData,
  checkExpiryFormData,
  processItemSubmission,
  processExpirySubmission,
};
