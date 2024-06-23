import { Stack, styled } from '@mui/material';

export const PopupStack = styled(Stack)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
  boxShadow:
    theme.palette.mode === 'light'
      ? 'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px'
      : 'rgb(255 255 255 / 25%) 0px 54px 55px, rgb(237 228 228 / 12%) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgb(221 205 205 / 17%) 0px 12px 13px, rgb(220 201 201 / 9%) 0px -3px 5px',
  borderRadius: '6px',
  border: 'none',
  // border:
  //   theme.palette.mode === 'light'
  //     ? '1.5px solid #000000c2'
  //     : '1.5px solid #ffffffcf',
}));
