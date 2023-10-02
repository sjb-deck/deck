import React from 'react';
import ReactDOM from 'react-dom/client';

import { ItemList } from '../../../pages';
import { InventoryProvider } from '../../../providers';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <ItemList />
  </InventoryProvider>,
);
