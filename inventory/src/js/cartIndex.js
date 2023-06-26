import React from 'react';
import ReactDOM from 'react-dom/client';

import NavBar from '../../../components/NavBar/NavBar';
import Theme from '../../../components/Themes';
import { INV_API_USER_URL } from '../../../globals';
import useFetch from '../hooks/use-fetch';

const CartIndex = () => {
  const { data: user, loading: userLoading } = useFetch(INV_API_USER_URL);

  return !userLoading ? (
    <Theme>
      <NavBar user={user} />
    </Theme>
  ) : null;
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<CartIndex />);
