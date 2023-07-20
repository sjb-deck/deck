import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

import AccordionItem from './AccordionItem';
import AccordionSummaryContent from './AccordionSummaryContent';
import ReturnForm from './ReturnForm';

const FullAccordion = ({ index, loan }) => {
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
            orderDate={loan.order_date}
            returnDate={loan.return_date}
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
        id={loan.order_id}
        open={openDialog}
        onClose={handleDialogClose}
      />
    </>
  );
};

FullAccordion.propTypes = {
  index: PropTypes.string.isRequired,
  loan: PropTypes.shape({
    order_id: PropTypes.number.isRequired,
    order_date: PropTypes.string.isRequired,
    return_date: PropTypes.string.isRequired,
    loanee_name: PropTypes.string.isRequired,
    order_items: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        expiry: PropTypes.string,
        type: PropTypes.string,
        quantity_opened: PropTypes.number.isRequired,
        quantity_unopened: PropTypes.number.isRequired,
        unit: PropTypes.string.isRequired,
        imgpic: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
};

export default FullAccordion;
