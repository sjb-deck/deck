import React from 'react';
import ReactDOM from 'react-dom/client';
import NavBar from '../../../components/NavBar/NavBar';
import Theme from '../../../components/Themes';

export const user = JSON.parse(htmlDecode(userInfo))[0];

const CartIndex = () => {
  return (
    <Theme>
      <NavBar user={user} />
    </Theme>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<CartIndex />);
