import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';

import { IMG_LOGO } from '../../globals/urls';
import { ImageAvatar } from '../ImageAvatar';

/**
 * Component for reviewing and confirming the new item details.
 *
 * @component
 * @param {Object} itemFormData - The form data for the new item.
 * @return {JSX.Element} - The rendered component.
 */

export const AddExpiryReview = ({ expiryFormData }) => {
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');

  useEffect(() => {
    if (!expiryFormData.imgpic.name) {
      setImagePreviewUrl(IMG_LOGO);
      return;
    }
    const objectUrl = URL.createObjectURL(expiryFormData.imgpic);
    setImagePreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [expiryFormData.imgpic]);

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
          <ImageAvatar alt='new-item' src={imagePreviewUrl} size={90} />
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
            {expiryFormData.name}
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
            {expiryFormData.type}
          </Typography>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
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
            {expiryFormData.unit}
          </Typography>
        </div>
        {expiryFormData.expiry.map((item, index) => {
          return (
            <div key={index}>
              <Box
                sx={{
                  outline: '1px solid gray',
                  padding: '8px',
                  position: 'relative',
                }}
              >
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
                    Expiry Date:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      textAlign: 'right',
                    }}
                  >
                    {item.expiry_date}
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
                    Quantity:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      textAlign: 'right',
                    }}
                  >
                    {item.quantity}
                  </Typography>
                </div>
              </Box>
            </div>
          );
        })}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '10px',
            marginTop: '20px',
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
            {expiryFormData.min_quantity}
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
            {expiryFormData.is_opened ? 'Yes' : 'No'}
          </Typography>
        </div>
      </div>
    </div>
  );
};
