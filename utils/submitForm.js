import axios from 'axios';
import findPotentialMatch from './levenshteinDistance';

const PLACEHOLDER_IMAGE =
  'https://cdn4.buysellads.net/uu/1/127419/1670531697-AdobeTeams.jpg';

// Normalised Levenshtein distance threshold
const LEVENSHTEIN_THRESHOLD = 0.2;

const isValidInt = (value) => {
  return Number.isInteger(value) && value >= 0;
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
    if (!isValidInt(itemFormData.min_quantityopen)) {
      tempItemFormError.min_quantityopen = true;
    }
    if (!isValidInt(itemFormData.min_quantityunopened)) {
      tempItemFormError.min_quantityunopened = true;
    }
    if (
      itemFormData.total_quantityopen <= 0 &&
      itemFormData.total_quantityunopened <= 0
    ) {
      tempItemFormError.total_quantityopen = true;
      tempItemFormError.total_quantityunopened = true;
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
) => {
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
      setSuccessDialogOpen(true);
      console.log(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};

export { checkItemFormData, processItemSubmission };
