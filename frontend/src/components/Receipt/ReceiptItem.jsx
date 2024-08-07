import { Chip, Stack, Typography } from '@mui/material';

import { IMG_LOGO } from '../../globals/urls';
import { ImageAvatar } from '../ImageAvatar';
import { Paper } from '../styled';

export const ReceiptItem = ({ item }) => {
  const itemExpiry = item.item_expiry;
  return (
    <Paper
      sx={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
      }}
    >
      <Stack
        direction='column'
        justifyContent='center'
        alignItems='center'
        spacing={1}
      >
        {itemExpiry.item.imgpic ? (
          <ImageAvatar
            alt={itemExpiry.item.name}
            src={itemExpiry.item.imgpic}
            size={90}
            isS3Image
          />
        ) : (
          <img src={IMG_LOGO} width={90} height={90} />
        )}

        <Chip
          label={itemExpiry.expiry_date ?? 'No Expiry'}
          color='primary'
          size='small'
        />
      </Stack>

      <Stack>
        <Typography variant='h5' fontWeight='bold'>
          {itemExpiry.item.name}
        </Typography>
        <Typography variant='caption'>
          Ordered Quantity: {item.ordered_quantity}
        </Typography>
        {item.returned_quantity != null && (
          <Typography variant='caption'>
            Returned Quantity: {item.returned_quantity}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
};
