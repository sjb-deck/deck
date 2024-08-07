import axios from 'axios';
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader';

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
  // TODO: Disable for now, will be removed later
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const authHeader = useAuthHeader();
  const request = axios.create({
    headers: {
      'Content-Type': 'application/json',
      Authorization: authHeader,
      'X-CSRFToken': getCSRFToken(),
      ...options?.headers,
    },
    withCredentials: true,
    ...options,
  });

  return request;
};
