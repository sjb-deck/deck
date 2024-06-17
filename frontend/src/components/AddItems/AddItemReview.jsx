import Typography from '@mui/material/Typography';

import { ImageAvatar } from '../ImageAvatar';

/**
 * Component for reviewing and confirming the new item details.
 *
 * @component
 * @param {Object} itemFormData - The form data for the new item.
 * @return {JSX.Element} - The rendered component.
 */

export const AddItemReview = ({ itemFormData }) => {
  return (
    <div>
      <Typography
        sx={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '10px' }}
      >
        Confirm New Item:
      </Typography>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: '90%',
          overflowX: 'auto',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '25px',
            marginTop: '10px',
          }}
        >
          <ImageAvatar
            alt='new-item'
            src={`/get_image/${itemFormData.image}`}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              lineHeight: '1.5',
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            Name:
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {itemFormData.name}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              lineHeight: '1.5',
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            Type:
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {itemFormData.type}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              lineHeight: '1.5',
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            Unit:
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {itemFormData.unit}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              lineHeight: '1.5',
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            Total Quantity:
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {itemFormData.total_quantity}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              lineHeight: '1.5',
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            Min Quantity:
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {itemFormData.min_quantity}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              lineHeight: '1.5',
              textAlign: 'left',
              fontWeight: 'bold',
            }}
          >
            Item Opened:
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {itemFormData.is_opened ? 'Yes' : 'No'}
          </Typography>
        </div>
      </div>
    </div>
  );
};
