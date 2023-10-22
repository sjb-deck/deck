import { PropTypes } from 'prop-types';
import React, { createContext, useState } from 'react';

import { SnackBarAlerts } from '../components';

export const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('error');
  const [message, setMessage] = useState('');
  const [autoHide, setAutoHide] = useState(true);

  const setAlert = (severity, message, autoHide) => {
    setSeverity(severity);
    setMessage(message);
    setOpen(true);
    setAutoHide(autoHide);
  };

  return (
    <AlertContext.Provider value={{ setAlert }}>
      <SnackBarAlerts
        autoHide={autoHide}
        severity={severity}
        message={message}
        open={open}
        onClose={() => setOpen(false)}
      />
      {children}
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node,
};
