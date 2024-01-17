import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from '@mui/material';
import React from 'react';
export const ViewExistingBlueprintTable = ({ items }) => {
  return (
    <Box className='dynamic-width'>
      <TableContainer component={Paper} style={{ overflow: 'scroll' }}>
        <Table>
          <TableHead>
            <TableRow key='View_Blueprint_Header'>
              <TableCell align='center'>
                <h3>Blueprints</h3>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <Accordion
                key={`Blueprint ${item.id}`}
                className='view-existing-blueprints'
              >
                <AccordionSummary
                  data-testid='item_accordion'
                  expandIcon={<ExpandMoreIcon />}
                >
                  <TableCell>
                    <Typography data-testid='item_name' variant={'h6'}>
                      {item.name}
                    </Typography>
                  </TableCell>
                  <TableCell align={'center'}>{item.quantity}</TableCell>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer
                    component={Paper}
                    style={{ overflow: 'scroll' }}
                  >
                    <Table>
                      <TableHead>
                        <TableRow key={`Blueprint items header ${item.id}`}>
                          <TableCell>Item Name</TableCell>
                          <TableCell align={'center'}>Qty</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.complete_content.map((blueprintItem) => (
                          <TableRow
                            key={`Blueprint item ${blueprintItem.item_id}`}
                            data-testid={`item-row-${blueprintItem.item_id}`}
                          >
                            <TableCell data-testid='blueprint_item'>
                              {blueprintItem.name}
                            </TableCell>
                            <TableCell
                              data-testid='blueprint_item_qty'
                              align={'center'}
                            >
                              {blueprintItem.quantity}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
