import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import React from 'react';

import AccordionItem from './AccordionItem';
import AccordionSummaryContent from './AccordionSummaryContent';

const FullAccordion = ({ index, loan }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const isPC = useMediaQuery('(min-width: 1000px)');

  return (
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
          order_date={loan.order_date}
          loanee_name={loan.loanee_name}
        />
      </AccordionSummary>
      <AccordionDetails>
        {loan.order_items.map((order_item, index) => (
          <div>
            <AccordionItem key={index} order_item={order_item} />
          </div>
        ))}
        <Button
          variant='outlined'
          color='primary'
          sx={{
            height: '25px',
            lineHeight: '25px',
            width: '100%',
            marginTop: '20px',
            fontSize: '10px',
          }}
        >
          Return
        </Button>
      </AccordionDetails>
    </Accordion>
  );
};

export default FullAccordion;
