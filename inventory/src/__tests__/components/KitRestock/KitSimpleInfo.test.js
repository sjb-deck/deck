import { screen } from '@testing-library/react';
import React from 'react';

import { KitSimpleInfo } from '../../../components/KitRestock/KitSimpleInfo';
import { exampleKit } from '../../../mocks';
import { render } from '../../../testSetup';

describe('<KitSimpleInfo />', () => {
  it('Renders correctly', async () => {
    render(<KitSimpleInfo kitData={exampleKit} />);

    expect(screen.getByText(exampleKit.name)).toBeInTheDocument();
    expect(screen.getByText(exampleKit.blueprint_name)).toBeInTheDocument();
    expect(
      screen.getByText(`${exampleKit.status}, ${exampleKit.complete}`),
    ).toBeInTheDocument();
  });
});
