/** @format */

// src/index.js
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import { getCookie } from '../../../inventory/src/utils';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submitForm = () => {
    $.ajax({
      type: 'POST',
      url: "/r'%5Elogin/$'",
      data: {
        username: username,
        password: password,
        to_redirect: getCookie('next'),
        csrfmiddlewaretoken: getCookie('csrftoken'),
      },
      success: function (data) {
        window.location.href =
          toRedirect == undefined || toRedirect == 'None' ? '/' : toRedirect;
      },
      error: function (xhr, status, error) {
        console.log('Login failed:', error);
        setMessage(JSON.parse(xhr['responseText']).responseText);
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
    <div className='login-div'>
      <img src='/static/inventory/img/StJohn SG logo.png'></img>
      <p className='lead error-message'>{message}</p>
      <input
        className='form-control'
        placeholder='Username'
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        className='form-control'
        type='password'
        placeholder='Password'
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button
        className='btn btn-primary'
        type='form'
        id='loginBtn'
        onClick={submitForm}
      >
        Login
      </button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
