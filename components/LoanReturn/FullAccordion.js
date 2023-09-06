import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import { AccordionItem } from './AccordionItem';
import { AccordionSummaryContent } from './AccordionSummaryContent';
import { ReturnForm } from './ReturnForm';

export const FullAccordion = ({ index, loan }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isPC = useMediaQuery('(min-width: 1000px)');
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
        sx={{
          maxWidth: '750px',
          minWidth: isMobile ? '90%' : isPC ? '50%' : '70%',
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <AccordionSummaryContent
            index={index}
            orderDate={loan.date}
            returnDate={loan.return_date ? loan.return_date : 'N/A'}
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

FullAccordion.propTypes = {
  index: PropTypes.number.isRequired, // Example: You can specify the expected type and requirements for 'index'
  loan: PropTypes.shape({
    id: PropTypes.number.isRequired, // Add this line for 'id'
    date: PropTypes.string.isRequired, // Example: You can specify the expected type and requirements for 'date'
    return_date: PropTypes.string, // Example: You can specify the expected type for 'return_date' (optional)
    loanee_name: PropTypes.string.isRequired, // Example: You can specify the expected type and requirements for 'loanee_name'
    order_items: PropTypes.array.isRequired, // This line specifies that 'order_items' should be an array but doesn't specify its structure
  }).isRequired,
};
