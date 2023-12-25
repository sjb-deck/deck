import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React from 'react';
import { LoadingSpinner } from '../LoadingSpinner';

export const BlueprintSelect = ({
  kitRecipeData,
  kitContentChange,
  kitContent,
  itemTotalQty,
  kitContentErrors,
  itemQuantityErrors,
  blueprintLoading,
}) => {
  const getExpiryQuantity = (itemId, expiryId) => {
    if (
      !kitContent.hasOwnProperty(itemId) ||
      !kitContent[itemId].hasOwnProperty(expiryId)
    )
      return '';
    return kitContent[itemId][expiryId].quantity;
  };

  const getExpiryError = (itemId, expiryId) => {
    if (
      !kitContentErrors ||
      !kitContentErrors.hasOwnProperty(itemId) ||
      !kitContentErrors[itemId].hasOwnProperty(expiryId)
    )
      return '';
    return kitContentErrors[itemId][expiryId];
  };

  const getItemError = (itemId) => {
    if (!itemQuantityErrors) return '';
    return itemQuantityErrors[itemId] ?? '';
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      <Stack>
        {blueprintLoading ? (
          <LoadingSpinner />
        ) : (
          kitRecipeData &&
          kitRecipeData.map((item) => {
            return (
              <Accordion
                data-testid={`blueprint-${item.item_id}`}
                key={item.item_id}
                defaultExpanded={true}
                sx={{ border: '2px solid #000' }}
              >
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography variant='h6'>{item.item_name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack
                    data-testid={`blueprint-item-${item.item_id}`}
                    spacing={2}
                  >
                    {item.item_options.map((o) => {
                      return (
                        <Stack
                          data-testid={`blueprint-itemExpiry-${o.item_expiry_id}`}
                          spacing={1}
                          key={o.item_expiry_id}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>ID:</span>
                            <span>{o.item_expiry_id}</span>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <span>Expiry Date:</span>
                            <span>{o.expiry_date}</span>
                          </Box>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: 2,
                            }}
                          >
                            <span>Quantity:</span>
                            <TextField
                              value={getExpiryQuantity(
                                item.item_id,
                                o.item_expiry_id,
                              )}
                              onChange={(e) =>
                                kitContentChange(
                                  o.item_expiry_id,
                                  item.item_id,
                                  e.target.value,
                                  o.quantity,
                                  item.required_quantity,
                                )
                              }
                              size='small'
                              type='tel'
                              sx={{
                                '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
                                  {
                                    display: 'none',
                                  },
                                '& input[type=number]': {
                                  MozAppearance: 'textfield',
                                },
                              }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position='end'>
                                    / {o.quantity}
                                  </InputAdornment>
                                ),
                              }}
                              inputProps={{
                                'data-testid': `blueprint-qty-${item.item_id}-${o.item_expiry_id}`,
                              }}
                              error={
                                !!getExpiryError(item.item_id, o.item_expiry_id)
                              }
                              helperText={getExpiryError(
                                item.item_id,
                                o.item_expiry_id,
                              )}
                            />
                          </Box>
                          <Divider
                            variant='middle'
                            sx={{ borderBottomWidth: 2 }}
                          />
                        </Stack>
                      );
                    })}
                    <Box
                      sx={{
                        display: 'flex',
                        width: 1,
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: 2,
                      }}
                    >
                      <span>Required Quantity:</span>
                      <TextField
                        disabled
                        size='small'
                        value={
                          itemTotalQty[item.item_id]
                            ? itemTotalQty[item.item_id].quantity
                            : 0
                        }
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              / {item.required_quantity}
                            </InputAdornment>
                          ),
                        }}
                        inputProps={{
                          'data-testid': `blueprint-required-${item.item_id}`,
                        }}
                        error={!!getItemError(item.item_id)}
                        helperText={getItemError(item.item_id)}
                      />
                    </Box>
                  </Stack>
                </AccordionDetails>
              </Accordion>
            );
          })
        )}
      </Stack>
    </Box>
  );
};
