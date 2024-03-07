import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import React, { useState } from 'react';

import { AccordionItem } from './AccordionItem';
import { AccordionSummaryContent } from './AccordionSummaryContent';
import { ReturnForm } from './ReturnForm';

import '../../../globals/styles/inventoryBase.scss';

export const FullAccordion = ({ index, loan }) => {
  const [openDialog, setOpenDialog] = useState(false); // State to control the dialog

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Accordion className='dynamic-width'>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <AccordionSummaryContent
            index={index}
            orderDate={loan.date}
            returnDate={loan.due_date ? loan.due_date : 'N/A'}
            loaneeName={loan.loanee_name}
          />
        </AccordionSummary>
        <AccordionDetails sx={{ marginTop: '-10px', marginBottom: '-10px' }}>
          {loan.order_items.map((orderItem, index) => (
            <div key={index}>
              <AccordionItem orderItem={orderItem} />
            </div>
          ))}
          <Button
            variant='outlined'
            color='primary'
            sx={{
              height: '30px',
              lineHeight: '25px',
              width: '80%',
              marginTop: '10px',
              fontSize: '12px',
              marginLeft: '10%',
              marginBottom: '10px',
              color: 'lightgreen',
            }}
            onClick={handleDialogOpen} // Open the dialog on button click
          >
            {'Return ' +
              loan.order_items.length +
              (loan.order_items.length === 1 ? ' item' : ' items')}
          </Button>
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
