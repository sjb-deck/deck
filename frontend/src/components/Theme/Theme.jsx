import CssBaseline from '@mui/material/CssBaseline';
import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import { createContext, useEffect, useMemo, useState } from 'react';

import { LOCAL_STORAGE_COLORMODE_KEY } from '../../globals/constants';

/**
 * A React component that sets the theme of the page
 * ie. light or dark mode
 * @returns Theme
 */

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const Theme = ({ children }) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const storedMode = localStorage.getItem(LOCAL_STORAGE_COLORMODE_KEY);
  const [mode, setMode] = useState(
    storedMode ? storedMode : prefersDarkMode ? 'dark' : 'light',
  );
  localStorage.setItem(LOCAL_STORAGE_COLORMODE_KEY, mode);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_COLORMODE_KEY, mode);
  }, [mode]);

  const theme = useMemo(() => {
    return responsiveFontSizes(
      createTheme({
        palette: {
          mode: mode,
          primary: {
            main: mode == 'dark' ? '#90caf9' : '#1e1e1e',
            light: mode == 'dark' ? '#e3f2fd' : '#484848',
            dark: mode == 'dark' ? '#42a5f5' : '#000000',
            contrastText: mode == 'dark' ? 'rgba(0, 0, 0, 0.87)' : '#fff',
          },
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
