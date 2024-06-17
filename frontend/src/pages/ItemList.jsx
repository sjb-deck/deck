import { Box, Button, ButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  Footer,
  LoadingSpinner,
  NavBar,
  ImportModal,
  ItemTable,
  EmptyMessage,
} from '../components';
import { useExportItems } from '../hooks/mutations';
import { useItems } from '../hooks/queries';

import '../globals/styles/inventoryBase.scss';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

export const ItemList = () => {
  const userData = useAuthUser();
  const { data: items, isLoading: itemsLoading } = useItems();
  const { mutate: onExportClick, isLoading: exportLoading } = useExportItems();
  const [modalOpen, setModalOpen] = useState(false);
  const [expiryDates, setExpiryDates] = useState([]);

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
      {(itemsLoading || exportLoading) && <LoadingSpinner />}
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
        <ImportModal open={modalOpen} setOpen={setModalOpen} />
        <ButtonGroup
          aria-label='text button group'
          className='dynamic-width'
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginBottom: 1,
          }}
        >
          <Button
            onClick={() => setModalOpen(true)}
            disabled={itemsLoading || exportLoading}
          >
            Import
          </Button>
          <Button
            onClick={onExportClick}
            disabled={itemsLoading || exportLoading}
          >
            Export
          </Button>
        </ButtonGroup>
        {!itemsLoading &&
          (expiryDates.length ? (
            <ItemTable items={expiryDates} />
          ) : (
            <EmptyMessage message='No items found' fullscreen={false} />
          ))}
      </Box>
      <div style={{ padding: '5vh' }} />
      <Footer />
    </>
  );
};
