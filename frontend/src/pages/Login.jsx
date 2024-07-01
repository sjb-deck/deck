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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { IMG_SPLASH, LOGIN_LOGO, URL_BASE_INV } from '../globals/urls';
import { useLogin } from '../hooks/mutations';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { mutate } = useLogin();

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

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const submitForm = () => {
    if (!username || !password) {
      setError(true);
      setMessage('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    setError(false);
    mutate(
      { username, password },
      {
        onError: () => {
          setError(true);
          setMessage('Invalid username or password');
          setIsLoading(false);
        },
        onSuccess: () => {
          setIsLoading(false);
          navigate(URL_BASE_INV);
        },
      },
    );
  };

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
          backgroundImage: `url(${IMG_SPLASH})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <img src={LOGIN_LOGO} style={{ maxHeight: '250px', mb: '5%' }} />
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
