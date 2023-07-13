import axios from 'axios';
import { useState } from 'react';

/**
 * Retrieves the CSRF token from the cookies.
 *
 * @return {string} The CSRF token, or an empty string if not found.
 */
function getCSRFToken() {
  const csrfCookie = document.cookie.match(/csrftoken=([^;]*)/);
  return csrfCookie ? csrfCookie[1] : '';
}

const usePostData = (url) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const postData = async (data) => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRFToken(),
        },
      });

      setResponse(response.data);
      return { status: 'success', data: response.data };
    } catch (error) {
      setError(error.message);
      return { status: 'error', error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { postData, isLoading, error, response };
};

export default usePostData;
