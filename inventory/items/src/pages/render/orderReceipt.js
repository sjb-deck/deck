import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../../../src/providers';
import { OrderReceipt } from '../orderReceipt';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <OrderReceipt />
  </InventoryProvider>,
);
