import SendIcon from '@mui/icons-material/Send';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { URL_INV_VIEW_KITS } from '../../globals/urls';
import { useCreateKit } from '../../hooks/mutations';
import { useKits, useKitRecipe } from '../../hooks/queries';
import { LoadingSpinner } from '../LoadingSpinner';

import { BlueprintSelect } from './BlueprintSelect';
import { kitAddValidation } from './schema';

export const KitCreate = () => {
  const { data: kitsData, isLoading } = useKits();
  const blueprints = kitsData ? kitsData.blueprints : [];
  const [selectedBlueprint, setSelectedBlueprint] = useState('');
  const { data: kitRecipeData, isLoading: blueprintLoading } =
    useKitRecipe(selectedBlueprint);
  const { mutate, isLoading: createKitLoading } = useCreateKit({});
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      blueprint: '',
      kitContent: {},
      itemTotalQty: {},
    },
    validationSchema: kitAddValidation,
    validateOnChange: false,
    onSubmit: () => {
      const content = Object.values(formik.values.kitContent)
        .map((v) => Object.values(v))
        .flat();
      const payload = {
        name: formik.values.name,
        blueprint: formik.values.blueprint,
        content,
      };
      mutate(payload, {
        onSuccess: () => {
          navigate(URL_INV_VIEW_KITS);
        },
      });
    },
  });

  useEffect(() => {
    if (!kitRecipeData) return;
    const newKitContent = {};
    for (const item of kitRecipeData) {
      for (const expiry of item.item_options) {
        if (!newKitContent[item.item_id]) newKitContent[item.item_id] = {};
        newKitContent[item.item_id][expiry.item_expiry_id] = {
          item_expiry_id: expiry.item_expiry_id,
          quantity: 0,
          expiryTotalQty: expiry.quantity,
          itemTotalQty: item.required_quantity,
        };
      }
    }
    formik.setFieldValue('kitContent', newKitContent);
    // adding formik into dependency array causes state update issues in jest
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kitRecipeData]);

  const getTotalQuantity = (itemId, kitContent) => {
    if (!(itemId in kitContent)) return 0;
    let sum = 0;
    for (const v of Object.values(kitContent[itemId])) {
      sum += v.quantity;
    }
    return sum;
  };

  const kitContentChange = (
    expiryId,
    itemId,
    val,
    expiryTotalQty,
    itemTotalQty,
  ) => {
    const quantity = val === '' ? 0 : parseInt(val);
    if (isNaN(quantity) || quantity < 0) return;
    const newKitContent = { ...formik.values.kitContent };
    const newItemTotalQty = { ...formik.values.itemTotalQty };
    if (!quantity) {
      delete newKitContent[itemId][expiryId];
    } else {
      newKitContent[itemId] = {
        ...newKitContent[itemId],
        [expiryId]: {
          item_expiry_id: expiryId,
          quantity,
          expiryTotalQty,
          itemTotalQty,
        },
      };
    }

    const newQty = getTotalQuantity(itemId, newKitContent);
    newItemTotalQty[itemId] = {
      quantity: newQty,
      totalQuantity: itemTotalQty,
    };

    formik.setFieldValue('kitContent', newKitContent);
    formik.setFieldValue('itemTotalQty', newItemTotalQty);
  };

  return (
    <>
      <Box
        sx={{
          minHeight: 0.8,
          display: 'flex',
          justifyContent: 'center',
          width: 1,
          marginTop: 10,
        }}
      >
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <Box
            sx={{
              p: 2,
              maxHeight: '100%',
              overflowY: 'auto',
            }}
            className='dynamic-width'
          >
            <Typography variant='h4' component='span'>
              Create Kit
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <br />
              <TextField
                label='Kit Name'
                value={formik.values.name}
                name='name'
                onChange={formik.handleChange}
                sx={{ width: 1 }}
                error={!!formik.errors.name}
                helperText={!!formik.errors.name && formik.errors.name}
                InputProps={{ 'data-testid': 'blueprint-name-input' }}
              />
              <FormControl data-testid='blueprint-form'>
                <InputLabel id='blueprint-label'>Blueprint</InputLabel>
                <Select
                  name='blueprint'
                  id='select'
                  labelId='blueprint-label'
                  label='Blueprint'
                  sx={{
                    '& .MuiInputLabel-root': {
                      fontSize: '14px',
                      color: 'inherit',
                    },
                    width: 1,
                  }}
                  inputProps={{ 'data-testid': 'blueprint-select' }}
                  value={selectedBlueprint}
                  onChange={(e) => {
                    const blueprintId = e.target.value;
                    setSelectedBlueprint(blueprintId);
                    formik.setFieldValue('blueprint', blueprintId);
                  }}
                >
                  {blueprints.map((b) => {
                    return (
                      <MenuItem key={b.id} value={b.id}>
                        {b.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <BlueprintSelect
                kitRecipeData={kitRecipeData}
                kitContentChange={kitContentChange}
                kitContent={formik.values.kitContent}
                itemTotalQty={formik.values.itemTotalQty}
                kitContentErrors={formik.errors.kitContent}
                itemQuantityErrors={formik.errors.itemTotalQty}
                blueprintLoading={blueprintLoading}
              />
              <Box
                sx={{ display: 'flex', width: 1, justifyContent: 'flex-end' }}
              >
                <LoadingButton
                  data-testid='blueprint-submit-btn'
                  loading={createKitLoading}
                  variant='contained'
                  endIcon={<SendIcon />}
                  sx={{ marginBottom: '20px' }}
                  onClick={formik.handleSubmit}
                >
                  Submit
                </LoadingButton>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
};
