import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Box, Button, Fade, Modal, Stack, TextField } from '@mui/material';
import { useState, useEffect } from 'react';

import { useAddBlueprint } from '../../hooks/mutations';

import { CreateBlueprintModalTable } from './CreateBlueprintModalTable';

export const CreateBlueprintModal = ({
  open,
  setOpen,
  blueprintItems,
  resetBlueprintItems,
}) => {
  const { mutate } = useAddBlueprint();
  const [blueprintName, setBlueprintName] = useState('');
  const [isNameError, setIsNameError] = useState(false);
  const [errorHelperText, setErrorHelperText] = useState(' ');

  useEffect(() => {
    setIsNameError(false);
    setErrorHelperText(' ');
  }, [blueprintItems, open]);

  const handleCreateBlueprint = async () => {
    const data = blueprintItems.map((item) => {
      return {
        item_id: item.id,
        quantity: item.quantity,
      };
    });
    const blueprint = {
      name: blueprintName,
      content: data,
    };
    mutate(blueprint);
    setOpen(false);
    resetBlueprintItems();
    setBlueprintName('');
  };

  const handleOnBlur = () => {
    if (blueprintName === '') {
      setIsNameError(true);
      setErrorHelperText('Blueprint name cannot be empty');
    } else {
      setIsNameError(false);
      setErrorHelperText(' ');
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
            height: '50%',
            backgroundColor: theme.palette.background.paper,
            padding: theme.spacing(4),
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            flexDirection: 'column',
            boxShadow:
              theme.palette.mode === 'light'
                ? 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
                : 'rgb(255 255 255 / 25%) 0px 54px 55px, rgb(237 228 228 / 12%) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgb(221 205 205 / 17%) 0px 12px 13px, rgb(220 201 201 / 9%) 0px -3px 5px',
            borderRadius: '6px',
            border: 'none',
          })}
        >
          <Stack
            gap={3}
            textAlign={'center'}
            style={{ paddingBottom: '25px', height: '100%' }}
          >
            <h2>Create Blueprint</h2>
            <TextField
              id='outlined-basic'
              placeholder='Enter Blueprint Name'
              value={blueprintName}
              error={isNameError}
              helperText={errorHelperText}
              onChange={(e) => {
                setBlueprintName(e.target.value);
              }}
              onBlur={handleOnBlur}
            />
            <CreateBlueprintModalTable items={blueprintItems} />
            <Button
              data-testid='create_blueprint_button'
              variant='contained'
              role='submit-button'
              color='success'
              endIcon={<AddCircleIcon />}
              disabled={blueprintName === '' || blueprintItems.length === 0}
              onClick={handleCreateBlueprint}
              style={{
                position: 'absolute',
                bottom: '10px',
                alignSelf: 'center',
              }}
            >
              Create
            </Button>
          </Stack>
        </Box>
      </Fade>
    </Modal>
  );
};
