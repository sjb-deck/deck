import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../providers';
import { KitRestock } from '../kitRestock';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <KitRestock />
  </InventoryProvider>,
);
