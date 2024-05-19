import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../providers';
import { KitLoanReturn } from '../kitLoanReturn';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <KitLoanReturn />
  </InventoryProvider>,
);
