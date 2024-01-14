import React from 'react';

import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'name', headerName: 'Item', width: 70 },
  { field: 'expiry_date', headerName: 'Expiry Date', width: 130 },
  { field: 'quantity', headerName: 'Quantity', width: 130 },
  {
    field: 'remaining',
    headerName: 'Remaining',
    type: 'number',
    width: 90,
  },
  {
    field: 'used',
    headerName: 'Used',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    // valueGetter: (params) =>
    //   `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const formatData = (data) => {
  return data.map((kitContent) => {
    return {
      name: kitContent.name,
      expiry_date: kitContent.expiry_date,
      quantity: kitContent.shown_quantity,
      remaining: kitContent.new_quantity,
      used: kitContent.quantity - kitContent.new_quantity,
    };
  });
};

export const ConfirmationTable = ({ confirmData }) => {
  console.log(confirmData);
  console.log(formatData(confirmData));
  return (
    <DataGrid
      rows={formatData(confirmData ?? [])}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 10]}
    />
  );
};
