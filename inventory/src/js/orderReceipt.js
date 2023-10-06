import React from 'react';
import ReactDOM from 'react-dom/client';

import { OrderReceipt } from '../../../pages/inventory';
import { InventoryProvider } from '../../../providers';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <OrderReceipt />
  </InventoryProvider>,
);
