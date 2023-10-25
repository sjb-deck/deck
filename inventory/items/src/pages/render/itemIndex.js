import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../../../src/providers';
import { ItemIndex } from '../itemIndex';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <ItemIndex />
  </InventoryProvider>,
);
