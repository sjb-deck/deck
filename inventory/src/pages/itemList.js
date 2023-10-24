import { Box, Button, ButtonGroup } from '@mui/material';
import React, { useEffect, useState } from 'react';

import {
  Footer,
  LoadingSpinner,
  NavBar,
  SnackBarAlerts,
  ImportModal,
  ItemTable,
} from '../components';
import { useExportItems } from '../hooks/mutations';
import { useItems, useUser } from '../hooks/queries';

import '../globals/styles/inventoryBase.scss';

export const ItemList = () => {
  const { data: user, loading: userLoading, error: userError } = useUser();
  const { data: items, loading: itemsLoading, error: itemsError } = useItems();
  const { mutate: onExportClick } = useExportItems();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userData, setUserData] = useState(user);
  const [modalOpen, setModalOpen] = useState(false);
  const [expiryDates, setExpiryDates] = useState([]);

  useEffect(() => {
    if (userError || itemsError) {
      setSnackbarOpen(true);
    }
    if (!userLoading && !userError) {
      setUserData(user);
    }
  }, [userLoading, userError, user, itemsError]);

  useEffect(() => {
    if (!items) return;
    const tmpExpiryDates = [];
    items.map((item) =>
      item.expiry_dates.map((expiry) => {
        tmpExpiryDates.push({
          ...item,
          ...expiry,
        });
      }),
    );
    setExpiryDates(tmpExpiryDates);
  }, [items]);

  return (
    <>
      <NavBar user={userData} />
      <SnackBarAlerts open={snackbarOpen} message={userError?.message} />
      <Box
        sx={{
          display: 'flex',

          justifyContent: 'center',
          marginTop: 10,
        }}
      ></Box>
      <Box
        sx={{
          width: 1,
          minHeight: 0.8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <ImportModal open={modalOpen} setOpen={setModalOpen} />
        <ButtonGroup
          aria-label='text button group'
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 1,
            width: { xs: '90%', sm: '70%', md: '70%', lg: '45%', xl: '35%' },
          }}
        >
          <Button onClick={() => setModalOpen(true)}>Import</Button>
          <Button onClick={onExportClick}>Export</Button>
        </ButtonGroup>
        {itemsLoading ? (
          <LoadingSpinner />
        ) : (
          expiryDates && <ItemTable items={expiryDates} />
        )}
      </Box>
      <Footer />
    </>
  );
};