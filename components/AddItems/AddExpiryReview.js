import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import React from 'react';

import { ExpiryFormDataPropType } from '../../globals';

/**
 * Component for reviewing and confirming the new item details.
 *
 * @component
 * @param {Object} itemFormData - The form data for the new item.
 * @return {JSX.Element} - The rendered component.
 */
export const AddExpiryReview = ({ expiryFormData }) => {
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
          <Avatar alt='new-item' src={expiryFormData.image} />
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
                    {item.date}
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
                    Total Quantity (Open):
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      textAlign: 'right',
                    }}
                  >
                    {item.total_quantityopen}
                  </Typography>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '2px',
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
                    Total Quantity (Unopened):
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '14px',
                      lineHeight: '1.5',
                      textAlign: 'right',
                    }}
                  >
                    {item.total_quantityunopened}
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
            Min Quantity (Open):
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {expiryFormData.min_quantityopen}
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
            Min Quantity (Unopened):
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {expiryFormData.min_quantityunopened}
          </Typography>
        </div>
      </div>
    </div>
  );
};

AddExpiryReview.propTypes = {
  expiryFormData: ExpiryFormDataPropType.isRequired,
};
