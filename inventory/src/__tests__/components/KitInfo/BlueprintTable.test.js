import { screen } from '@testing-library/react';
import { rest } from 'msw';
import React from 'react';

import { BlueprintItemTable } from '../../../components/ItemList/BlueprintItemTable';
import { Api } from '../../../globals';
import { mockItemList, server } from '../../../mocks';
import { render } from '../../../testSetup';
import { getUrlWithoutParams } from '../../../utils';

describe('<BlueprintItemTable />', () => {
  beforeEach(() =>
    server.use(
      rest.get(getUrlWithoutParams(Api['items']), (req, res, ctx) => {
        return res(ctx.status(200), ctx.json(mockItemList));
      }),
    ),
  );
  it('renders item list correctly', () => {
    render(
      <BlueprintItemTable items={mockItemList} updateSelectedItems={null} />,
    );
    // check if headers are rendered
    expect(screen.getByText('Item Name')).toBeInTheDocument();
    expect(screen.getByText('Unit')).toBeInTheDocument();
    expect(screen.getByText('Total Qty')).toBeInTheDocument();
    expect(screen.getByText('Qty To Add')).toBeInTheDocument();
    // check if items are rendered
    const itemNames = screen.queryAllByTestId('item_name');
    expect(itemNames.some((ele) => ele.textContent == 'test item')).toBe(true);
    expect(itemNames.some((ele) => ele.textContent == 'something new')).toBe(
      true,
    );
    expect(itemNames.some((ele) => ele.textContent == 'something new1')).toBe(
      true,
    );
    const itemUnits = screen.queryAllByTestId('item_unit');
    expect(itemUnits.some((ele) => ele.textContent == 'units')).toBe(true);
    expect(itemUnits.some((ele) => ele.textContent == '3')).toBe(true);
    expect(itemUnits.some((ele) => ele.textContent == '2')).toBe(true);
    const itemQtys = screen.queryAllByTestId('item_qty');
    expect(itemQtys.length > 0).toBe(true);
    expect(itemQtys.some((ele) => ele.textContent == '71')).toBe(true);
    expect(itemQtys.some((ele) => ele.textContent == '4')).toBe(true);
    expect(itemQtys.some((ele) => ele.textContent == '5')).toBe(true);
  });

  it('renders item list correctly when list is empty', () => {
    render(<BlueprintItemTable items={[]} updateSelectedItems={null} />);
    // check if empty message is rendered
    expect(screen.getByText('No matching items found')).toBeInTheDocument();
    // check that headers are not rendered
    expect(screen.queryByText('Item Name')).toBeNull();
    expect(screen.queryByText('Unit')).toBeNull();
    expect(screen.queryByText('Total Qty')).toBeNull();
    expect(screen.queryByText('Qty To Add')).toBeNull();
  });
});
