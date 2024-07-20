import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { KitInfoSection } from '../../../components';
import { exampleKit } from '../../../mocks';
import { render } from '../../../testSetup';

describe('<KitInfoSection />', () => {
  it('renders the kit info', () => {
    render(<KitInfoSection kitData={exampleKit} />);
    expect(screen.getByText(exampleKit.name)).toBeInTheDocument();
    expect(screen.getByText(exampleKit.blueprint_name)).toBeInTheDocument();
    expect(
      screen.getByText(`${exampleKit.status}, ${exampleKit.complete}`),
    ).toBeInTheDocument();
  });
});
