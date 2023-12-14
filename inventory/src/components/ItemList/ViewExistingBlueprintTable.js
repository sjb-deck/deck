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
    <Box
      className='nav-margin-compensate'
      sx={{
        width: {
          xs: '95%',
          sm: '90%',
          md: '70%',
        },
      }}
    >
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
              <Accordion key={item.id} style={{ marginBottom: '1rem' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <TableCell>
                    <Typography variant={'h6'}>{item.name}</Typography>
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
                        <TableRow key={item.id}>
                          <TableCell>Item Name</TableCell>
                          <TableCell align={'center'}>Qty</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {item.complete_content.map((blueprintItem) => (
                          <TableRow
                            key={blueprintItem.id}
                            data-testid={`item-row-${blueprintItem.id}`}
                          >
                            <TableCell>{blueprintItem.name}</TableCell>
                            <TableCell align={'center'}>
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
