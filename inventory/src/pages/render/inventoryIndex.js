import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../providers';
import { InventoryIndex } from '../inventoryIndex';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <InventoryIndex />
  </InventoryProvider>,
);
