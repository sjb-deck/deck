import { useState, useEffect } from 'react';

import { LOCAL_STORAGE_NOTIFICATIONS_KEY } from '../globals/constants';

import { NotificationContext } from './NotificationContext';

const getNotificationsFromLocalStorage = () => {
  const notifications = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
  return notifications ? JSON.parse(notifications) : {};
};

export const NotificationProvider = ({ children, value: testValues }) => {
  const defaultNotifications = getNotificationsFromLocalStorage();
  const [notifications, setNotifications] = useState(
    testValues || defaultNotifications,
  );

  useEffect(() => {
    localStorage.setItem(
      LOCAL_STORAGE_NOTIFICATIONS_KEY,
      JSON.stringify(notifications),
    );
  }, [notifications]);

  const setNotificationsState = (newNotifications) => {
    setNotifications(newNotifications);
  };

  const clearNotifications = () => {
    setNotifications({});
  };

  const contextValue = {
    notifications,
    setNotifications: setNotificationsState,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};
