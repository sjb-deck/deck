import React from 'react';
import ReactDOM from 'react-dom/client';

import { InventoryProvider } from '../../providers';
import { CreateBlueprint } from '../createBlueprint';

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(
  <InventoryProvider>
    <CreateBlueprint />
  </InventoryProvider>,
);
