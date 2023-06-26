import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * Component for reviewing and confirming the new item details.
 *
 * @component
 * @param {Object} itemFormData - The form data for the new item.
 * @return {JSX.Element} - The rendered component.
 */
function AddItemReview({ itemFormData }) {
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
          <Avatar alt='new-item' src={itemFormData.image} />
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
            Total Quantity (Open):
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {itemFormData.total_quantityopen}
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
            Total Quantity (Unopened):
          </Typography>
          <Typography
            sx={{ fontSize: '14px', lineHeight: '1.5', textAlign: 'right' }}
          >
            {itemFormData.total_quantityunopened}
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
            {itemFormData.min_quantityunopened}
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
            {itemFormData.min_quantityunopened}
          </Typography>
        </div>
      </div>
    </div>
  );
}

AddItemReview.propTypes = {
  itemFormData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    total_quantityopen: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    total_quantityunopened: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    min_quantityopen: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    min_quantityunopened: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
  }).isRequired,
};

export default AddItemReview;
