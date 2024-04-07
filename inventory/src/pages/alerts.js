import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';

import {
  NavBar,
  Footer,
  LoadingSpinner,
  ItemTable,
  EmptyMessage,
} from '../components';
import { useItems, useUser } from '../hooks/queries';

const Alerts = () => {
  const { data: items, isLoading: itemsLoading } = useItems();
  const { data: user, isLoading: userLoading } = useUser();
  const [expiryItems, setExpiryItems] = useState([]);
  const [lowQuantityItems, setLowQuantityItems] = useState([]);

  useEffect(() => {
    if (!userLoading && !userError) {
      setUserData(user);
    }
  }, [userLoading, user]);

  useEffect(() => {
    if (!items) return;
    const today = new Date();
    const expiryWindow = new Date();
    expiryWindow.setDate(today.getDate() + 30);

    const filteredExpiryItems = items.map((item) =>
      item.expiry_dates.filter((expiry) => new Date(expiry) <= expiryWindow),
    );
    setExpiryItems(filteredExpiryItems);
  }, [items]);

  useEffect(() => {
    if (!items) return;

    const filteredLowQuantityItems = items.filter((item) => item.quantity < 20);
    setLowQuantityItems(filteredLowQuantityItems);
  }, [items]);

  return (
    <>
      <NavBar user={user} />
      {(itemsLoading || userLoading) && <LoadingSpinner />}
      <Box
        className='nav-margin-compensate'
        sx={{
          width: 1,
          minHeight: 0.8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div>
          {!itemsLoading &&
            (expiryItems.length || lowQuantityItems.length ? (
              <ItemTable
                items={[...expiryItems, ...lowQuantityItems].map((item) => ({
                  id: item.id,
                  name: item.name,
                  type: item.type,
                  expiry_date: item.expiry_date,
                  quantity: item.quantity,
                }))}
              />
            ) : (
              <EmptyMessage message='No items found' fullscreen={false} />
            ))}
        </div>
      </Box>
      <Footer />
    </>
  );
};

export default Alerts;
