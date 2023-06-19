import axios from 'axios';

const PLACEHOLDER_IMAGE =
  'https://cdn4.buysellads.net/uu/1/127419/1670531697-AdobeTeams.jpg';

const isValidInt = (value) => {
  return Number.isInteger(value) && value >= 0;
};

const checkItemFormData = (itemFormData, setActiveStep) => {
  try {
    itemFormData.total_quantityopen = parseInt(itemFormData.total_quantityopen);
    itemFormData.total_quantityunopened = parseInt(
      itemFormData.total_quantityunopened,
    );
    itemFormData.min_quantityopen = parseInt(itemFormData.min_quantityopen);
    itemFormData.min_quantityunopened = parseInt(
      itemFormData.min_quantityunopened,
    );
  } catch {
    alert('Please enter a valid number for all quantity fields!');
    return;
  }

  if (itemFormData.name === '') {
    alert('Item Name must not be empty!');
  } else if (itemFormData.unit === '') {
    alert('Item Unit must not be empty!');
  } else if (
    !(
      isValidInt(itemFormData.total_quantityopen) &&
      isValidInt(itemFormData.total_quantityunopened) &&
      isValidInt(itemFormData.min_quantityopen) &&
      isValidInt(itemFormData.min_quantityunopened)
    )
  ) {
    alert('Quantities must be integers!');
  } else {
    if (itemFormData.image === '') {
      itemFormData.image = PLACEHOLDER_IMAGE;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }
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
) => {
  postWithCSRF('/inventory/add_item_post', itemFormData)
    .then((response) => {
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
