import React from 'react';
import ReactDOM from 'react-dom/client';

import LoanReturn from '../../../pages/inventory/loanReturn';
import { InventoryProvider } from '../../../providers';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <LoanReturn />
  </InventoryProvider>,
);
