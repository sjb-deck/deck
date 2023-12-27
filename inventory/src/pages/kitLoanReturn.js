import React from 'react';

import { NavBar, Footer, LoadingSpinner } from '../components';
import { KitInfoSection, KitItemReturnSection } from '../components';

import { useUser, useKit, useKitRecipe } from '../hooks/queries';
import { Box, Fab, Divider } from '@mui/material';

export const KitLoanReturn = () => {
  const { data: userData } = useUser();
  const params = new URLSearchParams(window.location.search);
  const { data: kitData } = useKit({
    kitId: params.get('kitId'),
  });

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
          <KitLoanReturnContent kitData={kitData} />
        ) : (
          <LoadingSpinner />
        )}
      </Box>
      <Footer />
    </>
  );
};

const KitLoanReturnContent = ({ kitData }) => {
  const { data: kitRecipeData } = useKitRecipe(kitData?.blueprint_id);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        flex: 1,
      }}
    >
      <KitInfoSection kitData={kitData} />
      <Divider
        orientation='vertical'
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
        kitContents={kitData ? kitData.content : []}
        kitBlueprint={
          kitRecipeData ? getBlueprintFromRecipe(kitRecipeData) : null
        }
      />
      <Fab
        variant='extended'
        color='primary'
        size='large'
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
      >
        Submit
      </Fab>
    </Box>
  );
};

const getBlueprintFromRecipe = (recipe) => {
  return recipe.map((item) => {
    return {
      id: item.item_id,
      name: item.item_name,
      required_quantity: item.required_quantity,
    };
  });
};
