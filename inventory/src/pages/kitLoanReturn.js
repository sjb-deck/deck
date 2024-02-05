import React, { useState } from 'react';

import { NavBar, Footer, LoadingSpinner } from '../components';
import {
  KitInfoSection,
  KitItemReturnSection,
  ConfirmationModal,
} from '../components';

import { useUser, useKit, useKitRecipe } from '../hooks/queries';
import { Box, Fab, Divider, useTheme, useMediaQuery } from '@mui/material';

export const KitLoanReturn = () => {
  const { data: userData } = useUser();

  const params = new URLSearchParams(window.location.search);
  const kitId = params.get('kitId');
  const { data: kitData } = useKit({ kitId: kitId });

  console.log(userData, kitData);
  return (
    <>
      <NavBar user={userData} />
      <Box
        sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
      >
        {/* Account for nav bar height */}
        <Box sx={{ height: '64px' }} />
        {kitData ? (
          <KitLoanReturnContent kitId={kitId} kitData={kitData} />
        ) : (
          <LoadingSpinner />
        )}
      </Box>
      <Footer />
    </>
  );
};

const KitLoanReturnContent = ({ kitId, kitData }) => {
  const [openConfirm, setOpenConfirm] = useState(false);

  const theme = useTheme();
  const { data: kitRecipeData } = useKitRecipe(kitData?.blueprint_id);

  const initialShownData = populateShownData(kitData, kitRecipeData);
  const [shownKitData, updateShownKitData] = React.useState(initialShownData);
  console.log(shownKitData);

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
        [theme.breakpoints.down('sm')]: {
          flexDirection: 'column',
        },
      })}
    >
      <KitInfoSection kitData={kitData} />
      <Divider
        orientation={
          useMediaQuery(theme.breakpoints.down('sm'))
            ? 'horizontal'
            : 'vertical'
        }
        variant='middle'
        flexItem
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[400]
              : theme.palette,
        }}
      />
      <KitItemReturnSection
        kitData={shownKitData}
        updateKitData={update(updateShownKitData, shownKitData)}
      />
      <Fab
        variant='extended'
        color='primary'
        size='large'
        onClick={() => setOpenConfirm(true)}
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        Submit
      </Fab>
      <ConfirmationModal
        kitId={kitId}
        data={shownKitData}
        openConfirm={openConfirm}
        closeDialog={() => setOpenConfirm(false)}
      />
    </Box>
  );
};

/**
 * Combines `kitData` and `kitRecipeData` into array of kit contents which follows this format:
 * - **id**
 * - **name**
 * - **quantity**: Original quantity present in the kit (Used to track how many items used)
 * - **new_quantity**: Same as quantity, modified by slider/textfield
 * - **shown_quantity**: Displayed quantity string out of blueprint quantity (if applicable)
 * - **blueprint_quantity**: Maximum blueprint quantity of that item allocated to the kit.
 * If undefined, no blueprint quantity set for the item
 * - **expiry_date**: "No expiry" if not applicable
 *
 * @param kitData
 * @param kitRecipeData
 * @returns Array of kit content formatted to be shown in UI
 */
const populateShownData = (kitData, kitRecipeData) => {
  if (kitData == null) return [];

  return kitData.content.map((kitItemContent) => {
    const blueprint_quantity = getBlueprintQuantity(
      kitItemContent,
      kitRecipeData,
    );
    const shown_quantity = getShownQuantity(
      kitItemContent.quantity,
      blueprint_quantity,
    );

    return {
      id: kitItemContent.item_expiry_id,
      name: kitItemContent.item_expiry.item.name,
      quantity: kitItemContent.quantity,
      new_quantity: kitItemContent.quantity,
      shown_quantity: shown_quantity,
      blueprint_quantity: blueprint_quantity,
      expiry_date: kitItemContent.item_expiry.expiry_date ?? 'No Expiry',
    };
  });
};

/**
 * Returns the displayed quantity as original quantity out blueprint quantity.
 * e.g. Original / Blueprint: 3/5
 * @param quantity
 * @param blueprint_quantity
 * @returns
 */
const getShownQuantity = (quantity, blueprint_quantity) => {
  if (!blueprint_quantity) return quantity;
  return `${quantity} / ${blueprint_quantity}`;
};

/**
 * For each kit item, find matching blueprint ids and retreive the required quantity for the item. 
 * @param kitItemContent An item from kit data
 * @param kitRecipeData Data related to a kit recipe which contains the blueprint information
 * @returns undefined if recipe data not available or no blueprint found for an item
 */
const getBlueprintQuantity = (kitItemContent, kitRecipeData) => {
  // Follow find function undefined returned when not found
  if (!kitRecipeData) {
    return undefined;
  }

  const blueprint_quantity = kitRecipeData.find(
    (blueprintItem) =>
      blueprintItem.item_id == kitItemContent.item_expiry.item.id,
  );

  return blueprint_quantity?.required_quantity;
};

/**
 * High-level function to be used by children components to update 
 * shownKitData object within kitLoanReturn page
 * @param updateFn React useState callback function to update shownKitData variable
 * @param kitData Stores all the shown kit contents 
 * @param index Index of kit content in the array of kit items to be changed
 * @param new_quantity Data from slider/text field
 * @returns 
 */
const update = (updateFn, kitData) => (index) => (new_quantity) => {
  kitData[index].new_quantity = new_quantity;
  updateFn([...kitData]);
};
