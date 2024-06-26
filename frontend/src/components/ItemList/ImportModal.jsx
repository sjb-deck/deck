import { Box, Button, Fade, Modal, Stack } from '@mui/material';
import { useContext, useState } from 'react';

import { useImportItems } from '../../hooks/mutations';
import { AlertContext } from '../../providers';
import { LoadingSpinner } from '../LoadingSpinner';

export const ImportModal = ({ open, setOpen }) => {
  const [file, setFile] = useState(null);
  const { mutate, isLoading } = useImportItems();
  const { setAlert } = useContext(AlertContext);
  const onImportClick = async (e) => {
    if (file) {
      mutate(file, {
        onSuccess: () => {
          setAlert({
            severity: 'success',
            message: 'Successfully imported items!',
            autoHide: true,
          });
          setFile(null);
          setOpen(false);
        },
      });
    }
  };

  return (
    <Modal
      aria-labelledby='keep-mounted-modal-title'
      aria-describedby='keep-mounted-modal-description'
      open={open}
      onClose={() => setOpen(false)}
    >
      <Fade in={open}>
        <Box
          sx={(theme) => ({
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            boxShadow: 24,
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(4),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          })}
        >
          {isLoading && <LoadingSpinner />}
          <Stack gap={3}>
            <h2>Upload CSV</h2>
            <span>
              Upload in the format: name, type, unit, total quantity, opened,
              expiry date, expiry date quantity, archived
            </span>
            <input
              type='file'
              data-testid='csv-input'
              accept='.csv'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <Button onClick={onImportClick}>Import CSV</Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};
