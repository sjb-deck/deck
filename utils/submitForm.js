import axios from 'axios';
import findPotentialMatch from './levenshteinDistance';
import dayjs from 'dayjs';

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
 * @param {number} totalQuantityopen - The total quantity open value.
 * @return {boolean} - True if there are no errors, false otherwise.
 */
function isNoErrorInArray(expiryErrorArray, totalQuantityopen) {
  for (let i = 0; i < expiryErrorArray.length; i++) {
    if (
      expiryErrorArray[i].total_quantityopen ||
      expiryErrorArray[i].total_quantityunopened ||
      expiryErrorArray[i].date
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
    !tempExpiryFormError.min_quantityopen &&
    !tempExpiryFormError.min_quantityunopened &&
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
      date:
        array.findIndex((elem, i) => elem.date === item.date && i !== index) !==
        -1,
      total_quantityopen: false,
      total_quantityunopened: false,
    })),
    min_quantityopen: false,
    min_quantityunopened: false,
  };

  for (let i = 0; i < expiryFormData.expiry.length; i++) {
    tempExpiryFormError.expiry.push({
      date: false,
      total_quantityopen: false,
      total_quantityunopened: false,
    });
  }

  for (let i = 0; i < expiryFormData.expiry.length; i++) {
    try {
      expiryFormData.expiry[i].total_quantityopen = parseInt(
        expiryFormData.expiry[i].total_quantityopen,
      );
    } catch {
      tempExpiryFormError.expiry[i].total_quantityopen = true;
    }
  }

  for (let i = 0; i < expiryFormData.expiry.length; i++) {
    try {
      expiryFormData.expiry[i].total_quantityunopened = parseInt(
        expiryFormData.expiry[i].total_quantityunopened,
      );
    } catch {
      tempExpiryFormError.expiry[i].total_quantityunopened = true;
    }
  }

  try {
    expiryFormData.min_quantityopen = parseInt(expiryFormData.min_quantityopen);
  } catch {
    tempExpiryFormError.min_quantityopen = true;
  }

  try {
    expiryFormData.min_quantityunopened = parseInt(
      expiryFormData.min_quantityunopened,
    );
  } catch {
    tempExpiryFormError.min_quantityunopened = true;
  }

  if (expiryFormData.name === '') {
    tempExpiryFormError.name = true;
  }

  if (expiryFormData.unit === '') {
    tempExpiryFormError.unit = true;
  }

  if (
    isNoErrorInArray(tempExpiryFormError.expiry) &&
    !tempExpiryFormError.min_quantityopen &&
    !tempExpiryFormError.min_quantityunopened
  ) {
    for (let i = 0; i < expiryFormData.expiry.length; i++) {
      if (!isValidInt(expiryFormData.expiry[i].total_quantityopen)) {
        tempExpiryFormError.expiry[i].total_quantityopen = true;
      }
      if (!isValidInt(expiryFormData.expiry[i].total_quantityunopened)) {
        tempExpiryFormError.expiry[i].total_quantityunopened = true;
      }
      if (
        expiryFormData.expiry[i].total_quantityopen <= 0 &&
        expiryFormData.expiry[i].total_quantityunopened <= 0
      ) {
        tempExpiryFormError.expiry[i].total_quantityopen = true;
        tempExpiryFormError.expiry[i].total_quantityunopened = true;
      }
      if (
        expiryFormData.expiry[i].date === null ||
        expiryFormData.expiry[i].date === dayjs(new Date()).format('YYYY-MM-DD')
      ) {
        tempExpiryFormError.expiry[i].date = true;
      }
    }

    if (!isValidInt(expiryFormData.min_quantityopen)) {
      tempExpiryFormError.min_quantityopen = true;
    }
    if (!isValidInt(expiryFormData.min_quantityunopened)) {
      tempExpiryFormError.min_quantityunopened = true;
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
  console.log(tempExpiryFormError);
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
    total_quantityopen: false,
    total_quantityunopened: false,
    min_quantityopen: false,
    min_quantityunopened: false,
  };

  try {
    itemFormData.total_quantityopen = parseInt(itemFormData.total_quantityopen);
  } catch {
    tempItemFormError.total_quantityopen = true;
  }

  try {
    itemFormData.total_quantityunopened = parseInt(
      itemFormData.total_quantityunopened,
    );
  } catch {
    tempItemFormError.total_quantityunopened = true;
  }

  try {
    itemFormData.min_quantityopen = parseInt(itemFormData.min_quantityopen);
  } catch {
    tempItemFormError.min_quantityopen = true;
  }

  try {
    itemFormData.min_quantityunopened = parseInt(
      itemFormData.min_quantityunopened,
    );
  } catch {
    tempItemFormError.min_quantityunopened = true;
  }

  if (itemFormData.name === '') {
    tempItemFormError.name = true;
  }

  if (itemFormData.unit === '') {
    tempItemFormError.unit = true;
  }

  if (
    !tempItemFormError.total_quantityopen &&
    !tempItemFormError.total_quantityunopened &&
    !tempItemFormError.min_quantityopen &&
    !tempItemFormError.min_quantityunopened
  ) {
    if (!isValidInt(itemFormData.total_quantityopen)) {
      tempItemFormError.total_quantityopen = true;
    }
    if (!isValidInt(itemFormData.total_quantityunopened)) {
      tempItemFormError.total_quantityunopened = true;
    }
    if (
      itemFormData.total_quantityopen <= 0 &&
      itemFormData.total_quantityunopened <= 0
    ) {
      tempItemFormError.total_quantityopen = true;
      tempItemFormError.total_quantityunopened = true;
    }
    if (!isValidInt(itemFormData.min_quantityopen)) {
      tempItemFormError.min_quantityopen = true;
    }
    if (!isValidInt(itemFormData.min_quantityunopened)) {
      tempItemFormError.min_quantityunopened = true;
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

/**
 * Retrieves the CSRF token from the cookies.
 *
 * @return {string} The CSRF token, or an empty string if not found.
 */
function getCSRFToken() {
  const csrfCookie = document.cookie.match(/csrftoken=([^;]*)/);
  return csrfCookie ? csrfCookie[1] : '';
}

/**
 * Performs a POST request with CSRF token included in the headers.
 *
 * @param {string} url - The URL to send the POST request to.
 * @param {object} data - The data to be included in the request body.
 * @return {Promise} A promise that resolves to the response of the POST request.
 */
function postWithCSRF(url, data) {
  const api = axios.create({
    headers: {
      'X-CSRFToken': getCSRFToken(),
      'Content-Type': 'application/json',
    },
  });

  return api.post(url, data);
}

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
  setLoading(true);
  postWithCSRF('/inventory/add_item_post', itemFormData)
    .then((response) => {
      setSuccessMessage(
        `${itemFormData.name} added successfully to the ${itemFormData.type} category!`,
      );
      setActiveStep(0);
      setAddType('');
      setItemFormData({
        name: '',
        type: 'General',
        unit: '',
        image: '',
        total_quantityopen: 0,
        total_quantityunopened: 0,
        min_quantityopen: 0,
        min_quantityunopened: 0,
      });
      setLoading(false);
      setSuccessDialogOpen(true);
      console.log(response.data);
    })
    .catch((error) => {
      setActiveStep(0);
      setAddType('');
      setItemFormData({
        name: '',
        type: 'General',
        unit: '',
        image: '',
        total_quantityopen: 0,
        total_quantityunopened: 0,
        min_quantityopen: 0,
        min_quantityunopened: 0,
      });
      setLoading(false);
      setErrorDialogOpen(true);
      console.error(error);
    });
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
  setLoading(true);
  const modifiedExpiry = expiryFormData.expiry.map((item) => ({
    expirydate: item.date,
    quantityopen: item.total_quantityopen,
    quantityunopened: item.total_quantityunopened,
  }));

  const sumTotalQuantityOpen = modifiedExpiry.reduce(
    (total, item) => total + item.quantityopen,
    0,
  );
  const sumTotalQuantityUnopened = modifiedExpiry.reduce(
    (total, item) => total + item.quantityunopened,
    0,
  );

  const formData = {
    item_fields: {
      name: expiryFormData.name,
      type: expiryFormData.type,
      unit: expiryFormData.unit,
      image: expiryFormData.image,
      total_quantityopen: sumTotalQuantityOpen,
      total_quantityunopened: sumTotalQuantityUnopened,
      min_quantityopen: expiryFormData.min_quantityopen,
      min_quantityunopened: expiryFormData.min_quantityunopened,
    },
    expiry: modifiedExpiry,
  };
  postWithCSRF('/inventory/add_expiry_post', formData)
    .then((response) => {
      setSuccessMessage(
        `${expiryFormData.name} added successfully - with expiry date(s) - to the ${expiryFormData.type} category!`,
      );
      setActiveStep(0);
      setAddType('');
      setExpiryFormData({
        name: '',
        type: 'General',
        unit: '',
        image: '',
        expiry: [
          {
            item: 0,
            date: dayjs(new Date()).format('YYYY-MM-DD'),
            total_quantityopen: 0,
            total_quantityunopened: 0,
          },
        ],
        min_quantityopen: 0,
        min_quantityunopened: 0,
      });

      setExpiryFormError({
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
      setLoading(false);
      setSuccessDialogOpen(true);
      console.log(response.data);
    })
    .catch((error) => {
      setActiveStep(0);
      setAddType('');
      setExpiryFormData({
        name: '',
        type: 'General',
        unit: '',
        image: '',
        expiry: [
          {
            item: 0,
            date: dayjs(new Date()).format('YYYY-MM-DD'),
            total_quantityopen: 0,
            total_quantityunopened: 0,
          },
        ],
        min_quantityopen: 0,
        min_quantityunopened: 0,
      });

      setExpiryFormError({
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
      setLoading(false);
      setErrorDialogOpen(true);
      console.error(error);
    });
};

export {
  checkItemFormData,
  checkExpiryFormData,
  processItemSubmission,
  processExpirySubmission,
};
