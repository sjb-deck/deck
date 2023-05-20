/** @format */

// src/index.js
import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const submitForm = () => {
    $.ajax({
      type: 'POST',
      url: '/r\'%5Elogin/$\'',
      data: {
        username: username,
        password: password,
        to_redirect: toRedirect,
        csrfmiddlewaretoken: CSRF_TOKEN,
      },
      success: function(data) {
        window.location.href =
          data.toRedirect == 'None' ? '/' : data.toRedirect;
      },
      error: function(xhr, status, error) {
        console.log('Login failed:', error);
        setMessage(JSON.parse(xhr['responseText']).responseText);
      },
    });
  };
  return (
    <div className="login-div">
      <img src="/static/inventory/img/StJohn SG logo.png"></img>
      <p className="lead error-message">{message}</p>
      <input
        className="form-control"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      ></input>
      <input
        className="form-control"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      ></input>
      <button className="btn btn-primary" type="submit" onClick={submitForm}>
        Login
      </button>
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<App />);
