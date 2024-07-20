import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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
