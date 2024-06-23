import { Avatar, Button, Stack, Typography } from '@mui/material';
import '../../globals/styles/inventoryBase.scss';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  URL_INV_KITS_LOAN_RETURN,
  URL_INV_KITS_RESTOCK,
} from '../../globals/urls';
import { useKitRecipe } from '../../hooks/queries';
import { AlertContext, KitCartContext } from '../../providers';
import { buildUrl, stringAvatar } from '../../utils';

import { KitContentsAccordion } from './KitContentsAccordion';
import { KitHistoryAccordion } from './KitHistoryAccordion';

export const KitInfoContent = ({ kitData }) => {
  const { kitCartItems, addToCart } = useContext(KitCartContext);
  const isInCart = kitCartItems.some((item) => item.id === kitData.id);
  const { data: kitRecipeData } = useKitRecipe(kitData?.blueprint_id);
  const { setAlert } = useContext(AlertContext);
  const navigate = useNavigate();
  const withdrawHandler = () => {
    if (isInCart) return;
    addToCart({
      id: kitData.id,
      blueprint_name: kitData.blueprint_name,
      name: kitData.name,
      complete: kitData.complete,
    });
    setAlert({
      severity: 'success',
      message: `${kitData.name} added to cart!`,
      autoHide: true,
    });
  };
  return (
    <Stack
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
      }}
      className='nav-margin-compensate'
    >
      <Avatar {...stringAvatar(kitData?.name)} />
      <Typography variant='h3'>{kitData?.name}</Typography>
      <Typography variant='h6'>{kitData?.blueprint_name}</Typography>
      <Typography variant='overline'>
        {kitData?.status}, {kitData?.complete}
      </Typography>
      {kitData?.status !== 'RETIRED' && (
        <Stack spacing={2} marginTop={2} marginBottom={5}>
          {kitData?.status == 'READY' ? (
            <>
              <Button
                variant='contained'
                color='error'
                disabled={isInCart}
                onClick={withdrawHandler}
              >
                Withdraw
              </Button>
              {kitData?.complete == 'incomplete' && (
                <Button
                  variant='contained'
                  color='success'
                  onClick={() =>
                    navigate(
                      buildUrl(URL_INV_KITS_RESTOCK, { kitId: kitData.id }),
                    )
                  }
                >
                  Restock
                </Button>
              )}
            </>
          ) : (
            <Button
              variant='contained'
              color='success'
              onClick={() =>
                navigate(
                  buildUrl(URL_INV_KITS_LOAN_RETURN, { kitId: kitData.id }),
                )
              }
            >
              Return
            </Button>
          )}
        </Stack>
      )}
      <KitContentsAccordion
        kitContents={kitData.content}
        kitBlueprint={
          kitRecipeData ? getBlueprintFromRecipe(kitRecipeData) : null
        }
      />
      <KitHistoryAccordion kitId={kitData.id} />
    </Stack>
  );
};

const getBlueprintFromRecipe = (recipe) => {
  return recipe.map((item) => {
    return {
      id: item.item_id,
      name: item.item_name,
      required_quantity: item.required_quantity,
    };
  });
};
