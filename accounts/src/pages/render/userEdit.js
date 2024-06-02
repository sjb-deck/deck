import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../../../inventory/src/providers';
import { UserEdit } from '../userEdit';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <UserEdit />
  </InventoryProvider>,
);
