import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';

import '../../globals/styles/inventoryBase.scss';
import { LoadingSpinner } from '../LoadingSpinner';

import { columns } from './labels';

export const KitContentsAccordion = ({ kitContents, kitBlueprint }) => {
  const isMobile = useMediaQuery('(max-width: 800px)');

  const rows = [
    ...kitContents.map((item) => {
      return {
        id: item.item_expiry_id,
        name: item.item_expiry.item.name,
        expiry: item.item_expiry.expiry_date ?? 'No Expiry',
        quantity: getFractionOfItem(item, kitBlueprint),
      };
    }),
    ...getMissingItems(kitContents, kitBlueprint),
  ];
  return (
    <Accordion className='dynamic-width' defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Stack>
          <Grid item xs={2}>
            Kit Contents
          </Grid>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        {kitBlueprint ? (
          <DataGrid
            rows={rows}
            columns={columns(isMobile)}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnSelector
          />
        ) : (
          <LoadingSpinner />
        )}
      </AccordionDetails>
    </Accordion>
  );
};

const getFractionOfItem = (item, blueprint) => {
  if (!blueprint) return item.quantity;
  const blueprintItem = blueprint.find((blueprintItem) => {
    return blueprintItem.id == item.item_expiry.item.id;
  });
  return blueprintItem?.required_quantity
    ? `${item.quantity} / ${blueprintItem.required_quantity}`
    : item.quantity;
};

const getMissingItems = (kitContents, kitBlueprint) => {
  if (!kitBlueprint) return [];
  return kitBlueprint
    .filter((blueprintItem) => {
      const kitItem = kitContents.find((kitItem) => {
        return blueprintItem.id == kitItem.item_expiry.item.id;
      });
      return !kitItem;
    })
    .map((item) => {
      return {
        id: item.id,
        name: item.name,
        expiry: 'NIL',
        quantity: `0 / ${item.required_quantity}`,
      };
    });
};
