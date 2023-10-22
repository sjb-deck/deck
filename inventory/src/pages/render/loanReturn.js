import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../providers';
import { LoanReturn } from '../loanReturn';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <LoanReturn />
  </InventoryProvider>,
);
