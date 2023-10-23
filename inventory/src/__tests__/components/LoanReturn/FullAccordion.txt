import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom/extend-expect'; // Import the jest-dom matchers
import FullAccordion from '../../../components/LoanReturn/FullAccordion';

xdescribe('FullAccordion', () => {
  const testData = {
    index: '1',
    loan: {
      order_id: 123,
      order_date: '2023-07-20',
      return_date: '2023-07-25',
      loanee_name: 'John Doe',
      order_items: [
        {
          name: 'Item 1',
          expiry: '2023-12-31',
          type: 'Sample',
          quantity_opened: 5,
          quantity_unopened: 3,
          unit: 'pcs',
          imgpic: '/path/to/image1',
        },
        {
          name: 'Item 2',
          expiry: '2023-12-31',
          type: 'Sample',
          quantity_opened: 10,
          quantity_unopened: 2,
          unit: 'pcs',
          imgpic: '/path/to/image2',
        },
      ],
    },
  };

  test('should render the component with correct data', () => {
    render(<FullAccordion index={testData.index} loan={testData.loan} />);

    // Assert that the AccordionSummaryContent is rendered with the correct data
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Return 2 items')).toBeInTheDocument();
  });

  test('should open the dialog when the "Return items" button is clicked', () => {
    render(<FullAccordion index={testData.index} loan={testData.loan} />);

    // Click on the "Return items" button
    fireEvent.click(screen.getByText('Return 2 items'));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Return Form')).toBeInTheDocument();
  });
});
