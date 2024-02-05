import React, { useContext } from 'react';
import { AlertContext } from '../../providers';

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

export const ConfirmationModal = ({ kitId, data, openConfirm, closeDialog }) => {
  const { setAlert } = useContext(AlertContext);

  const handleSubmit = () => {
    const submissionData = mapSubmissionKitData(kitId, data);
    console.log(submissionData);
    closeDialog();
  };

  return (
    <Dialog
      fullWidth
      open={openConfirm}
      onClose={closeDialog}
      scroll={'paper'}
      aria-labelledby='scroll-dialog-title'
      aria-describedby='scroll-dialog-description'
    >
      <DialogTitle id='scroll-dialog-title'>{'Confirm Loan Return'}</DialogTitle>
      <DialogContent dividers>
        <DataGrid
          sx={{ width: "100%" }}
          rows={formatKitData(data)}
          columns={columns}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          hideFooterPagination
          hideFooterSelectedRowCount
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeDialog}>Cancel</Button>
        <Button onClick={handleSubmit}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

const columns = [
  { field: 'id', headerName: 'ID', width: 10, sortable: false },
  { field: 'name', headerName: 'Item', flex: 2, minWidth: 100 },
  { field: 'expiry_date', headerName: 'Expiry Date', flex: 1.5, minWidth: 100 },
  { field: 'quantity', headerName: 'Quantity', flex: 1, minWidth: 75 },
  {
    field: 'remaining',
    headerName: 'Left',
    // type: 'number',
    minWidth: 75,
    flex: 1,
  },
  {
    field: 'used',
    headerName: 'Used',
    minWidth: 75,
    flex: 1,
  },
];

const formatKitData = (data) => {
  if (!data) return [];

  return data.map((kitContent, index) => {
    return {
      id: index,
      name: kitContent.name,
      expiry_date: kitContent.expiry_date,
      quantity: kitContent.shown_quantity,
      remaining: kitContent.new_quantity,
      used: kitContent.quantity - kitContent.new_quantity,
    };
  });
};

const mapSubmissionKitData = (kitId, kitData) => {
  const kitContent = kitData.map((kitItem) => ({
    quantity: kitItem.new_quantity,
    item_expiry_id: kitItem.id,
  }));

  return {
    kit_id: kitId,
    content: kitContent
  };
};
