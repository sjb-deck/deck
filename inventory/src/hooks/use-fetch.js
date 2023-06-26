import axios from 'axios';
import { useState, useEffect } from 'react';

/**
 * The function uses the Fetch API to make a GET request to a specified URL and returns the response
 * data, loading status, and error (if any) as an object.
 * @param url - The URL of the API endpoint that we want to fetch data from.
 * @return An object with three properties: `data`, `loading`, and `error`.
 */

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
