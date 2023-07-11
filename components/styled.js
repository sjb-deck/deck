import { styled, Paper as MUIPaper, Box as MUIBox } from '@mui/material';

export const Paper = styled(MUIPaper)(({ theme }) => ({
  minWidth: '20vw',
  width: '90%',
  [theme.breakpoints.up('sm')]: {
    width: '70%',
  },
  [theme.breakpoints.up('md')]: {
    width: '55%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '45%',
  },
  [theme.breakpoints.up('xl')]: {
    width: '35%',
  },
  padding: theme.spacing(2),
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export const Box = styled(MUIBox)(({ theme }) => ({
  minWidth: '20vw',
  width: '90%',
  [theme.breakpoints.up('sm')]: {
    width: '70%',
  },
  [theme.breakpoints.up('md')]: {
    width: '55%',
  },
  [theme.breakpoints.up('lg')]: {
    width: '45%',
  },
  [theme.breakpoints.up('xl')]: {
    width: '35%',
  },
  display: 'flex',
  flexDirection: 'column',
}));
