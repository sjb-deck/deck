import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../../../src/providers';
import { ItemList } from '../itemList';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <ItemList />
  </InventoryProvider>,
);
