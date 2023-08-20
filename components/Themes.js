import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import React from 'react';

/**
 * A React component that sets the theme of the page
 * ie. light or dark mode
 * @returns Theme
 */

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});

export const Theme = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [mode, setMode] = React.useState(prefersDarkMode ? 'dark' : 'light');
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = React.useMemo(() => {
    return responsiveFontSizes(
      createTheme({
        palette: {
          mode: mode,
        },
      }),
    );
  }, [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

Theme.propTypes = {
  children: PropTypes.node,
};
