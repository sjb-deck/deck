import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../providers';
import { KitInfo } from '../kitInfo';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <KitInfo />
  </InventoryProvider>,
);
