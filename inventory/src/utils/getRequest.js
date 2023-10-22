import axios from 'axios';

/**
 * Retrieves the CSRF token from the cookies.
 *
 * @return {string} The CSRF token, or an empty string if not found.
 */
function getCSRFToken() {
  const csrfCookie = document.cookie.match(/csrftoken=([^;]*)/);
  return csrfCookie ? csrfCookie[1] : '';
}

export const getRequest = () => {
  const request = axios.create({
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
  });

  return request;
};
