import SendIcon from '@mui/icons-material/Send';
import { Button, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';

import { LoadingSpinner } from '../LoadingSpinner';

import { KitRestockOptionAccordion } from './KitRestockOptionAccordion';
import { KitSimpleInfo } from './KitSimpleInfo';

import '../../globals/styles/inventoryBase.scss';
import { useRestockKit } from '../../hooks/mutations';
import { useKitRestockOptions } from '../../hooks/queries';

export const KitRestockContent = ({ kit }) => {
  const { data: kitRestockOptions } = useKitRestockOptions(kit.id);
  const [restockData, setRestockData] = useState([]);
  const [errors, setErrors] = useState([]);
  const { mutate: restockKit, isLoading: restockLoading } = useRestockKit();
  const setRestockValues = (itemId, optionsData) => {
    const newData = restockData.map((itemData) => {
      if (itemData.item_id == itemId) {
        return { ...itemData, item_options: optionsData };
      }
      return itemData;
    });
    setRestockData(newData);
    isQtyMoreThanRequired(newData, kitRestockOptions);
  };

  useEffect(() => {
    if (!kitRestockOptions) return;
    setRestockData(
      kitRestockOptions.map((item) => {
        return {
          item_id: item.item_id,
          item_options: item.item_options.map((option) => {
            return { item_expiry_id: option.item_expiry_id, quantity: 0 };
          }),
        };
      }),
    );
  }, [kitRestockOptions]);

  const checkAndSubmit = () => {
    if (!isQtyMoreThanRequired(restockData, kitRestockOptions)) {
      const requestBody = buildRequestBody(restockData);
      restockKit(requestBody);
    }
  };

  const buildRequestBody = (currentData) => {
    const requestBody = {
      kit_id: kit.id,
      content: [],
    };

    for (const itemRestockData of currentData) {
      for (const itemRestockOption of itemRestockData.item_options) {
        if (itemRestockOption.quantity == 0) continue;
        requestBody.content.push({
          item_expiry_id: itemRestockOption.item_expiry_id,
          quantity: itemRestockOption.quantity,
        });
      }
    }

    return requestBody;
  };

  const isQtyMoreThanRequired = (currentData, kitRestockOptions) => {
    let check = false;
    let newErrors = [...errors];

    for (const itemRestockOptions of kitRestockOptions) {
      const itemRestockData = currentData.find(
        (itemData) => itemData.item_id == itemRestockOptions.item_id,
      );
      if (!itemRestockData) continue;
      const totalQuantity = itemRestockData.item_options.reduce(
        (acc, option) => {
          return acc + option.quantity;
        },
        0,
      );
      if (totalQuantity > itemRestockOptions.missing_quantity) {
        newErrors.push({
          item_id: itemRestockOptions.item_id,
          message: 'Quantity more than required',
        });
        check = true;
      } else {
        newErrors = newErrors.filter(
          (error) => error.item_id != itemRestockOptions.item_id,
        );
      }
    }

    setErrors(newErrors);
    return check;
  };

  const isNoRestockAction = (currentData) => {
    for (const itemRestockData of currentData) {
      const totalQuantity = itemRestockData.item_options.reduce(
        (acc, option) => {
          return acc + option.quantity;
        },
        0,
      );
      if (totalQuantity > 0) return false;
    }
    return true;
  };
  return (
    <>
      {kitRestockOptions && !restockLoading ? (
        <Stack
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
          className='nav-margin-compensate'
          spacing={2}
        >
          <>
            <KitSimpleInfo kitData={kit} />
            <div style={{ marginTop: '30px' }}></div>
            {kitRestockOptions.map((item) => {
              return (
                <KitRestockOptionAccordion
                  key={item.item_id}
                  item={item}
                  restockValues={
                    restockData?.find(
                      (itemData) => itemData.item_id == item.item_id,
                    )?.item_options
                  }
                  setRestockValues={(v) => setRestockValues(item.item_id, v)}
                  error={errors.find((error) => error.item_id == item.item_id)}
                />
              );
            })}
          </>

          <Button
            variant='contained'
            color='success'
            size='large'
            endIcon={<SendIcon />}
            className='dynamic-width'
            style={{ marginTop: '50px' }}
            onClick={checkAndSubmit}
            disabled={errors.length > 0 || isNoRestockAction(restockData)}
          >
            Submit
          </Button>
        </Stack>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
};
