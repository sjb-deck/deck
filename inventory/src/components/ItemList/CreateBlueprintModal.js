import { Box, Button, Fade, Modal, Stack, TextField } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import React, { useContext, useState, useEffect } from 'react';

import { useImportItems } from '../../hooks/mutations';
import { AlertContext } from '../../providers';
import { LoadingSpinner } from '../LoadingSpinner';

import { CreateBlueprintModalTable } from './CreateBlueprintModalTable';

export const CreateBlueprintModal = ({ open, setOpen, blueprintItems }) => {
  const { mutate, isLoading } = useImportItems();
  const queryClient = useQueryClient();
  const { setAlert } = useContext(AlertContext);
  const [blueprintName, setBlueprintName] = useState('');

  useEffect(() => {}, [blueprintItems]);

  const handleCreateBlueprint = async () => {
    const blueprint = {
      name: blueprintName,
      items: blueprintItems,
    };
    await mutate(blueprint, {
      onSuccess: () => {
        setOpen(false);
        queryClient.invalidateQueries('blueprints');
      },
    });
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
            height: '50%',
            boxShadow: 24,
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(4),
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
          })}
        >
          {isLoading && <LoadingSpinner />}
          <Stack
            gap={3}
            textAlign={'center'}
            style={{ paddingBottom: '15px', height: '100%' }}
          >
            <h2>Create Blueprint</h2>
            <TextField
              id='outlined-basic'
              placeholder='Enter Blueprint Name'
              value={blueprintName}
              onChange={(e) => {
                setBlueprintName(e.target.value);
              }}
            />
            {blueprintItems.length === 0 ? (
              <h2>No items added!</h2>
            ) : (
              <CreateBlueprintModalTable items={blueprintItems} />
            )}
            <Button
              style={{
                position: 'absolute',
                bottom: '5px',
                alignSelf: 'center',
              }}
              onClick={null}
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};
