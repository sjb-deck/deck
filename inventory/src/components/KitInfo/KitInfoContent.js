import { Avatar, Button, Stack, Typography } from '@mui/material';
import React from 'react';

import '../../globals/styles/inventoryBase.scss';
import { useKitRecipe } from '../../hooks/queries';
import { stringAvatar } from '../../utils';

import { KitContentsAccordion } from './KitContentsAccordion';
import { KitHistoryAccordion } from './KitHistoryAccordion';

export const KitInfoContent = ({ kitData }) => {
  const { data: kitRecipeData } = useKitRecipe(kitData?.blueprint_id);
  return (
    <Stack
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
      className='nav-margin-compensate'
    >
      <Avatar {...stringAvatar(kitData?.name)} />
      <Typography variant='h3'>{kitData?.name}</Typography>
      <Typography variant='h6'>{kitData?.blueprint_name}</Typography>
      <Typography variant='overline'>
        {kitData?.status}, {kitData?.complete}
      </Typography>
      <Stack spacing={2} marginTop={2} marginBottom={5}>
        {kitData?.status == 'READY' ? (
          <>
            <Button variant='contained' color='error'>
              Withdraw
            </Button>
            {kitData?.complete == 'incomplete' && (
              <Button variant='contained' color='success'>
                Restock
              </Button>
            )}
          </>
        ) : (
          <Button variant='contained' color='success'>
            Return
          </Button>
        )}
      </Stack>
      <KitContentsAccordion
        kitContents={kitData.content}
        kitBlueprint={
          kitRecipeData ? getBlueprintFromRecipe(kitRecipeData) : null
        }
      />
      <KitHistoryAccordion kitId={kitData.id} />
    </Stack>
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
