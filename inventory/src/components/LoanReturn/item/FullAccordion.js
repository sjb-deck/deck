import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import React, { useState } from 'react';

import { AccordionItem } from './AccordionItem';
import { AccordionSummaryContent } from './AccordionSummaryContent';
import { ReturnForm } from './ReturnForm';

import '../../../globals/styles/inventoryBase.scss';

export const FullAccordion = ({ index, loan, isMobile }) => {
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Accordion
        key={loan.id}
        data-testid={`item-${loan.id}`}
        sx={{
          width: isMobile ? '95%' : '70%',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <AccordionSummaryContent
            index={loan.id}
            orderDate={loan.date}
            returnDate={loan.due_date ? loan.due_date : 'N/A'}
            loaneeName={loan.loanee_name}
            isMobile={isMobile}
          />
        </AccordionSummary>
        <AccordionDetails
          sx={{ marginTop: '-10px', marginBottom: '-10px' }}
          data-testid={`details-${loan.id}`}
        >
          <Divider variant='middle' sx={{ borderBottomWidth: 2 }} />
          <Stack spacing={1} sx={{ marginTop: 2, marginBottom: 1 }}>
            {loan.order_items.map((orderItem, index) => (
              <div key={index}>
                <AccordionItem orderItem={orderItem} />
              </div>
            ))}
          </Stack>
          <Box
            sx={{
              width: 1,
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: 2,
              gap: 2,
            }}
          >
            <Button
              variant='contained'
              color='success'
              onClick={handleDialogOpen} // Open the dialog on button click
            >
              Return
            </Button>
          </Box>
        </AccordionDetails>
      </Accordion>
      <ReturnForm
        items={loan.order_items}
        id={loan.id}
        open={openDialog}
        onClose={handleDialogClose}
      />
    </>
  );
};
