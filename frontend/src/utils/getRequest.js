import axios from 'axios';
import { getAccessToken } from '../hooks/auth/authHook';

/**
 * Retrieves the CSRF token from the cookies.
 *
 * @return {string} The CSRF token, or an empty string if not found.
 */
function getCSRFToken() {
  const csrfCookie = document.cookie.match(/csrftoken=([^;]*)/);
  return csrfCookie ? csrfCookie[1] : '';
}

export const getRequest = (options) => {
  const request = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
      'X-CSRFToken': getCSRFToken(),
      ...options?.headers,
    },
    withCredentials: true,
    ...options,
  });

  return request;
};
