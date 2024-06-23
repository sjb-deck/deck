import { ExpandMore } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Grid,
  Stack,
} from '@mui/material';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  URL_INV_KITS_INFO,
  URL_INV_KITS_LOAN_RETURN,
  URL_INV_KITS_RESTOCK,
} from '../../globals/urls';
import { AlertContext, KitCartContext } from '../../providers';
import { buildUrl } from '../../utils';

const kitStatus = {
  LOANED: 'On Loan',
  READY: 'Ready',
  SERVICING: 'Servicing',
  RETIRED: 'Retired',
};

export const KitData = ({ kit, isMobile }) => {
  const { kitCartItems, addToCart } = useContext(KitCartContext);
  const isInCart = kitCartItems.some((item) => item.id === kit.id);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const withdrawHandler = () => {
    if (isInCart) return;
    addToCart({
      id: kit.id,
      blueprint_name: kit.blueprint_name,
      name: kit.name,
      complete: kit.complete,
    });
    setAlert({
      severity: 'success',
      message: `${kit.name} added to cart!`,
      autoHide: true,
    });
  };
  return (
    <Accordion
      data-testid={`kit-${kit.id}`}
      key={kit.id}
      sx={{
        width: isMobile ? '95%' : '70%',
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        id={`panel${kit.id}-header`}
        aria-controls={`panel${kit.id}-content`}
      >
        <Grid container>
          <Grid item xs={2}>
            {kit.id}
          </Grid>
          <Grid item xs={isMobile ? 5 : 3}>
            {kit.name}
          </Grid>
          <Grid item xs={isMobile ? 5 : 4}>
            {kitStatus[kit.status]}
          </Grid>
          {!isMobile && (
            <Grid item xs={3}>
              {kit.complete === 'complete' ? 'Complete' : 'Incomplete'}
            </Grid>
          )}
        </Grid>
      </AccordionSummary>
      <AccordionDetails data-testid={`details-${kit.id}`}>
        <Divider variant='middle' sx={{ borderBottomWidth: 2 }} />
        <Stack spacing={1} sx={{ marginTop: 2, marginBottom: 1 }}>
          {kit.content.map((item) => {
            return (
              <Box
                key={item.item_expiry.item.id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{item.item_expiry.item.name}</span>
                <span>{item.quantity}</span>
              </Box>
            );
          })}
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
            color='info'
            variant='contained'
            onClick={() =>
              navigate(buildUrl(URL_INV_KITS_INFO, { kitId: kit.id }))
            }
          >
            View Kit
          </Button>
          {kit.status === 'READY' && (
            <Button
              color='error'
              variant='contained'
              disabled={isInCart}
              onClick={withdrawHandler}
            >
              Withdraw
            </Button>
          )}
          {kit.status === 'LOANED' && (
            <Button
              color='success'
              variant='contained'
              onClick={() =>
                navigate(buildUrl(URL_INV_KITS_LOAN_RETURN, { kitId: kit.id }))
              }
            >
              Return
            </Button>
          )}
          {kit.complete != 'complete' && kit.status !== 'LOANED' && (
            <Button
              color='success'
              variant='contained'
              onClick={() =>
                navigate(buildUrl(URL_INV_KITS_RESTOCK, { kitId: kit.id }))
              }
            >
              Restock
            </Button>
          )}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
