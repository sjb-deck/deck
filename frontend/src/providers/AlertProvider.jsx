import { createContext, useState } from 'react';

import { ErrorPopup, SnackBarAlerts } from '../components/Alerts';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('error');
  const [message, setMessage] = useState('');
  const [autoHide, setAutoHide] = useState(true);
  const [additionalInfo, setAdditionalInfo] = useState('');

  const setAlert = ({ severity, message, autoHide, additionalInfo }) => {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
    setAutoHide(autoHide);
    setAdditionalInfo(additionalInfo);
  };

  return (
    <AlertContext.Provider value={{ setAlert }}>
      {severity != 'error' ? (
        <SnackBarAlerts
          autoHide={autoHide}
          severity={severity}
          message={message}
          open={open}
          onClose={() => setOpen(false)}
        />
      ) : (
        <ErrorPopup
          open={open}
          message={message}
          additionalInfo={additionalInfo}
        />
      )}
      {children}
    </AlertContext.Provider>
  );
};
