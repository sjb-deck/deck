import { Breadcrumbs, Chip, Typography } from '@mui/material';
import { emphasize, styled } from '@mui/material/styles';

import {
  IMG_LOGO,
  URL_BASE_INV,
  URL_INV_ITEMS,
  URL_INV_VIEW_KITS,
} from '../../globals/urls';

export const NavIcon = () => {
  const currentUrl = window.location.pathname.split('/').filter((x) => x);
  const isIndexPage = currentUrl.length <= 2;
  const isItemsPage = currentUrl[1] == 'items';
  const isKitsPage = currentUrl[1] == 'kits';
  const isAlertPage = currentUrl[1] == 'alerts';
  const isLoanPage = currentUrl[1] == 'loan_return';
  const getIconClickUrl = () => {
    if (isIndexPage || isLoanPage) return URL_BASE_INV;
    if (isItemsPage) return URL_INV_ITEMS;
    if (isKitsPage) return URL_INV_VIEW_KITS;
  };
  return (
    <>
      {isIndexPage ? (
        <>
          <img
            height={35}
            style={{ marginRight: 10, cursor: 'pointer' }}
            src='/img/logo.png'
            alt='logo'
            onClick={() => (window.location.href = getIconClickUrl())}
          />
          <Typography
            style={{ cursor: 'pointer' }}
            variant='h6'
            component='div'
            sx={{ flexGrow: 1, display: { xs: 'block', sm: 'block' } }}
            onClick={() => (window.location.href = getIconClickUrl())}
          >
            IMS
          </Typography>
        </>
      ) : (
        <NavBreadcrumbs
          isKitsPage={isKitsPage}
          isItemsPage={isItemsPage}
          isLoanPage={isLoanPage}
          isAlertPage={isAlertPage}
        />
      )}
    </>
  );
};

const NavBreadcrumbs = ({
  isKitsPage,
  isItemsPage,
  isLoanPage,
  isAlertPage,
}) => {
  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
      theme.palette.mode === 'light'
        ? theme.palette.grey[100]
        : theme.palette.grey[800];
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontSize: theme.typography.pxToRem(16),
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.06),
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12),
      },
    };
  });
  return (
    <>
      <Breadcrumbs
        aria-label='breadcrumb'
        style={{ flexGrow: 1, color: 'white' }}
      >
        <StyledBreadcrumb
          component='a'
          href={URL_BASE_INV}
          label='Home'
          icon={<img height={20} src={IMG_LOGO} alt='logo' />}
        />
        <StyledBreadcrumb
          component='a'
          href={
            isItemsPage ? URL_INV_ITEMS : isKitsPage ? URL_INV_VIEW_KITS : '#'
          }
          label={isItemsPage ? 'Items' : isKitsPage ? 'Kits' : '_'}
        />
      </Breadcrumbs>
    </>
  );
};
