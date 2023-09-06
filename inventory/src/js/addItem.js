import React from 'react';
import ReactDOM from 'react-dom/client';

import AddItem from '../../../pages/inventory/addItem';
import { InventoryProvider } from '../../../providers';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <AddItem />
  </InventoryProvider>,
);
