import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../providers';
import { AdminIndex } from '../adminIndex';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <AdminIndex />
  </InventoryProvider>,
);
