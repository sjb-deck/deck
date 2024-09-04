import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from './authHook';
import { URL_LOGIN } from '../../globals/urls';
import { AlertContext } from '../../providers';

export const useSignOutDeck = () => {
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
