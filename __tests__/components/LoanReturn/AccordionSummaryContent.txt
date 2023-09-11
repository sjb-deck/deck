import { render, screen } from '@testing-library/react';
import React from 'react';

import '@testing-library/jest-dom/extend-expect'; // Import the jest-dom matchers
import AccordionSummaryContent from '../../../components/LoanReturn/AccordionSummaryContent';

xdescribe('AccordionSummaryContent', () => {
  const testData = {
    index: '1',
    orderDate: '2023-07-20',
    returnDate: '2023-07-25',
    loaneeName: 'John Doe',
  };

  test('should render the component with correct data', () => {
    render(
      <AccordionSummaryContent
        index={testData.index}
        orderDate={testData.orderDate}
        returnDate={testData.returnDate}
        loaneeName={testData.loaneeName}
      />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Return:')).toBeInTheDocument();
    expect(screen.getByText('Order:')).toBeInTheDocument();
    expect(screen.getByText('Loanee:')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });
});
