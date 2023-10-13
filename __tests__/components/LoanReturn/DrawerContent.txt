import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom/extend-expect'; // Import the jest-dom matchers
import DrawerContent from '../../../components/LoanReturn/DrawerContent';

xdescribe('DrawerContent', () => {
  const testData = {
    name: 'Test Item',
    expiry: '2023-12-31',
    type: 'Sample',
    quantity_opened: 10,
    quantity_unopened: 5,
    unit: 'pcs',
    imgpic: '/path/to/image',
  };

  test('should render the component with correct data', () => {
    render(<DrawerContent item={testData} />);

    expect(screen.getByText('Item Name:')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
    expect(screen.getByText('Expiry Date:')).toBeInTheDocument();
    expect(screen.getByText('Type:')).toBeInTheDocument();
    expect(screen.getByText('Sample')).toBeInTheDocument();
    expect(screen.getByText('Unit:')).toBeInTheDocument();
    expect(screen.getByText('pcs')).toBeInTheDocument();
    expect(screen.getByText('Opened Qty Loaned:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('Unopened Qty Loaned:')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    // Assert that the avatar image is rendered
    const avatarImage = screen.getByAltText('new-item');
    expect(avatarImage).toBeInTheDocument();
    expect(avatarImage).toHaveAttribute('src', '/path/to/image');
  });
});
