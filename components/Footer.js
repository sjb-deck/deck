import React from 'react';
import { Box, Typography, Link, Paper, Divider } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const footerPadding = 4;
const sectionPadding = 3;

const SectionHeader = ({ text }) => {
  return (
    <Typography
      color='text.primary'
      gutterBottom
      sx={{
        letterSpacing: 2,
        textTransform: 'uppercase',
        fontWeight: 'medium',
        fontSize: 'default',
      }}
    >
      {text}
    </Typography>
  );
};

const CustomLink = ({ text, link }) => {
  return (
    <Typography>
      <Link
        href={link}
        variant='body2'
        color='text.secondary'
        underline='hover'
      >
        {text}
      </Link>
    </Typography>
  );
};

/**
 * A React component that is renders the footer
 * ie. the container at the very bottom of the page
 * @returns Footer
 */
const Footer = () => {
  return (
    <Box component='footer'>
      <Paper
        sx={{
          mt: 3,
          width: '100vw',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
          p: footerPadding,
        }}
      >
        <Box
          sx={(theme) => ({
            display: 'flex',
            flexDirection: 'row',
            paddingBottom: footerPadding / 2,
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column',
              minHeight: '50vh',
            },
          })}
        >
          <Box sx={{ flex: 3, p: sectionPadding }}>
            <SectionHeader text='About IMS' />
            <Typography variant='body2' color='text.secondary'>
              Inventory Management System for Nan Hua St John Brigade (NHSJB)
            </Typography>
          </Box>

          <Box sx={{ flex: 1, p: sectionPadding }}>
            <SectionHeader text='Categories' />
            <CustomLink text='Items' link='https://www.facebook.com/' />
            <CustomLink text='Kits' link='https://www.facebook.com/' />
            <CustomLink text='Alerts' link='https://www.facebook.com/' />
          </Box>

          <Box sx={{ flex: 1, p: sectionPadding }}>
            <SectionHeader text='Quick Links' />
            <CustomLink text='Portal' link='https://nhhs-sjb.org/' />
            <CustomLink text='Github' link='https://www.facebook.com/' />
          </Box>
        </Box>

        <Divider
          variant='middle'
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[400]
                : theme.palette.grey[600],
          }}
        />
        <Box mt={sectionPadding}>
          <Typography variant='body2' color='text.secondary' align='center'>
            {/* {'Copyright © '}
            <Link color='inherit' href='https://your-website.com/'>
              IMS
            </Link>{' '}
            {new Date().getFullYear()} */}
            Source code is on Github!
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Footer;
