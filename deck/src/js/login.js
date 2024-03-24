/** @format */

// src/index.js
import { Visibility, VisibilityOff } from '@mui/icons-material';
import LoginIcon from '@mui/icons-material/Login';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  Stack,
  TextField,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { getCookie } from '../../../inventory/src/utils';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: '#1e1e1e',
        light: '#484848',
        dark: '#000000',
        contrastText: '#fff',
      },
    },
  });

  const submitForm = () => {
    setIsLoading(true);
    setError(false);
    $.ajax({
      type: 'POST',
      url: "/r'%5Elogin/$'",
      data: {
        username: username,
        password: password,
        next: getCookie('next'),
        csrfmiddlewaretoken: getCookie('csrftoken'),
      },
      success: function (data) {
        window.location.href = data.toRedirect;
        setIsLoading(false);
      },
      error: function (xhr, status, error) {
        console.log('Login failed:', error);
        setMessage(JSON.parse(xhr['responseText']).responseText);
        setError(true);
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    const handleKeyDownEvent = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        const btn = document.getElementById('loginBtn');
        btn.click();
      }
    };
    document.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      document.removeEventListener('keydown', handleKeyDownEvent);
    };
  });

  useEffect(() => {
    setUsername('');
    setPassword('');
  }, []);

  return (
    <ThemeProvider theme={lightTheme}>
      <Stack
        spacing={2}
        alignItems='center'
        sx={{
          width: '100vw',
          height: '100vh',
          backgroundRepeat: 'repeat',
          backgroundImage: "url('/static/inventory/img/A6.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img
          src='/static/inventory/img/StJohn SG logo.png'
          style={{ maxHeight: '250px', mb: '5%' }}
        />
        <FormControl
          error={error}
          sx={{ m: 1, width: '25ch' }}
          variant='filled'
        >
          <TextField
            label='Username'
            variant='filled'
            onChange={(e) => {
              setError(false);
              setUsername(e.target.value);
            }}
          />
          {error && <FormHelperText>{message}</FormHelperText>}
        </FormControl>
        <FormControl
          error={error}
          sx={{ m: 1, width: '25ch' }}
          variant='filled'
        >
          <InputLabel htmlFor='filled-adornment-password'>Password</InputLabel>
          <FilledInput
            id='filled-adornment-password'
            onChange={(e) => {
              setError(false);
              setPassword(e.target.value);
            }}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
          {error && <FormHelperText>{message}</FormHelperText>}
        </FormControl>
        <Box sx={{ m: 2 }} />
        <LoadingButton
          onClick={submitForm}
          endIcon={<LoginIcon />}
          loading={isLoading}
          loadingPosition='end'
          variant='outlined'
          size='large'
        >
          <span>Login</span>
        </LoadingButton>
      </Stack>
    </ThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
