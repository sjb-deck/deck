import React from 'react';
import ReactDOM from 'react-dom/client';

import AdminIndex from '../../../pages/inventory/adminIndex';
import { InventoryProvider } from '../../../providers';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <AdminIndex />
  </InventoryProvider>,
);
