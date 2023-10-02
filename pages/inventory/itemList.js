import { Box, Button, ButtonGroup } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

import {
  Footer,
  LoadingSpinner,
  NavBar,
  SnackBarAlerts,
} from '../../components';
import { ImportModal } from '../../components/ItemList/ImportModal';
import ItemTable from '../../components/ItemList/ItemTable';
import { useItems, useUser } from '../../hooks/queries';

import '../../inventory/src/scss/inventoryBase.scss';

export const ItemList = () => {
  const { data: user, loading: userLoading, error: userError } = useUser();
  const { data: items, loading: itemsLoading, error: itemsError } = useItems();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [userData, setUserData] = useState(user);
  const [modalOpen, setModalOpen] = useState(false);
  console.log(items);
  useEffect(() => {
    if (userError || itemsError) {
      setSnackbarOpen(true);
    }
    if (!userLoading && !userError) {
      setUserData(user);
    }
  }, [userLoading, userError, user, itemsError]);

  const onExportClick = async () => {
    const rsp = await axios.get('/inventory/api/export_items', {
      responseType: 'blob',
    });
    const blob = new Blob([rsp.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'items.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

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
        <ImportModal open={modalOpen} handleClose={() => setModalOpen(false)} />
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
          {/* <form onSubmit={onImportClick}>
            <input
              type='file'
              accept='.csv'
              onChange={(e) => setFile(e.target.files[0])}
            />
          </form> */}
          <Button onClick={() => setModalOpen(true)}>Import</Button>
          <Button onClick={onExportClick}>Export</Button>
        </ButtonGroup>
        {itemsLoading ? (
          <LoadingSpinner />
        ) : (
          items && <ItemTable items={items} />
        )}
      </Box>
      <Footer />
    </>
  );
};
