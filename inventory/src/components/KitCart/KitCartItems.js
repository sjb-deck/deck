import { Stack } from '@mui/material';
import React, { useContext } from 'react';

import { KitCartContext } from '../../providers';
import { Box } from '../styled';

import { KitCartItem } from './KitCartItem';

export const KitCartItems = () => {
  const { kitCartItems } = useContext(KitCartContext);

  return (
    <Box overflow='auto' maxHeight='50vh'>
      <Stack
        justifyContent='center'
        alignItems='center'
        height={'50%'}
        spacing={2}
        padding={1}
      >
        {kitCartItems.map((item) => (
          <KitCartItem key={item.id} kitCartItem={item} />
        ))}
      </Stack>
    </Box>
  );
};
