import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../../../src/providers';
import { AddItem } from '../addItem';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <AddItem />
  </InventoryProvider>,
);
