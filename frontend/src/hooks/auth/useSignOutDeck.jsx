import { useContext } from 'react';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { useNavigate } from 'react-router-dom';

import { URL_LOGIN } from '../../globals/urls';
import { AlertContext } from '../../providers';

export const useSignOutDeck = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const { setAlert } = useContext(AlertContext);

  const signOutAndNavigate = () => {
    signOut();
    navigate(URL_LOGIN);
    setAlert({
      severity: 'info',
      message: 'You have been signed out.',
      autoHide: true,
    });
  };

  return signOutAndNavigate;
};
