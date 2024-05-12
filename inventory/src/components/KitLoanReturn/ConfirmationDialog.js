import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';

import { useReturnKit } from '../../hooks/mutations/useReturnKit';

export const ConfirmationModal = ({
  kitId,
  data,
  openConfirm,
  closeDialog,
}) => {
  const { mutate } = useReturnKit();

  const handleSubmit = () => {
    const submissionData = mapSubmissionKitData(kitId, data);
    mutate(submissionData);
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
      <DialogTitle id='scroll-dialog-title'>
        {'Confirm Loan Return'}
      </DialogTitle>
      <DialogContent dividers>
        <DataGrid
          sx={{ width: '100%' }}
          rows={formatKitData(data)}
          columns={columns}
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          disableDensitySelector
          hideFooterPagination
          hideFooterSelectedRowCount
          disableVirtualization // to allow jest tests to view all columns
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

/**
 * Formats the given kitData to be shown on the confirmation table. This is similar to
 * the data shown previously with the addition of displaying the quantity used for each
 * item.
 * @param {*} data
 * @return {*}
 */
const formatKitData = (data) => {
  if (!data) return [];

  return data.map((kitContent, index) => {
    return {
      id: index,
      name: kitContent.name,
      expiry_date: kitContent.expiry_date,
      quantity: kitContent.shown_quantity,
      remaining: kitContent.newQuantity,
      used: Number(kitContent.quantity) - Number(kitContent.newQuantity),
    };
  });
};

/**
 * Maps the given kitData for submission to return_kit_order API endpoint. Format:
 * {
 *    kit_id: number,
 *    content: array of kit items
 * }
 * Each item has the following format:
 * {
 *    item_expiry_id: number,
 *    quantity: number
 * }
 * @param {*} kitId
 * @param {*} kitData
 * @return {*}
 */
const mapSubmissionKitData = (kitId, kitData) => {
  const kitContent = kitData.map((kitItem) => ({
    quantity: kitItem.new_quantity,
    item_expiry_id: kitItem.id,
  }));

  return {
    kit_id: kitId,
    content: kitContent,
  };
};
