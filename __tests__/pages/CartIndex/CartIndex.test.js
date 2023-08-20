import { screen, waitForElementToBeRemoved } from '@testing-library/react';
import React from 'react';

import { CartIndex } from '../../../pages/inventory/';
import { render } from '../../../testSetup';

describe('<CartIndex />', () => {
  it('renders the component correctly', async () => {
    render(<CartIndex />);

    await waitForElementToBeRemoved(() => screen.getByRole('progressbar'));

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
