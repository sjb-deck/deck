import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { IMSRoutes } from './components/index.js';
import { DeckProvider } from './providers';

const Deck = () => {
  return (
    <StrictMode>
      <DeckProvider>
        <BrowserRouter>
          <IMSRoutes />
        </BrowserRouter>
      </DeckProvider>
    </StrictMode>
  );
};

export default Deck;
