import React from 'react';
import ReactDOM from 'react-dom/client';
import Theme from '/components/Themes';
import NavBar from '/components/NavBar/NavBar';
import Footer from '/components/Footer';

// this parses and decodes to give us data in the form of objects
// u can console log to see how it looks like
export const user = JSON.parse(htmlDecode(userInfo))[0];
export const items = JSON.parse(htmlDecode(allItems));

// you can send data from react (ie. here) to djano's views.py
// can take a look at deck/src/js/login.js which is done with ajax
// and can look at how its being handled in django's views.py (deck/views.py)
// ajax is one way and prob not the best way can look at other methods

const ItemList = () => {
  return (
    <Theme>
      <NavBar user={user} />
      <p>Placeholder</p>
      <Footer />
    </Theme>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root')); // this places our react app in the root div in item_list.html
root.render(<ItemList />);
