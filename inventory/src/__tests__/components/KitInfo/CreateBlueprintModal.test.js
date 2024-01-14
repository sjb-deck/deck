import { screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { CreateBlueprintModal } from '../../../components/ItemList/CreateBlueprintModal';
import { exampleCreateNewBlueprint } from '../../../mocks';
import { render } from '../../../testSetup';

describe('<CreateBlueprintModal />', () => {
  it('renders selected blueprint list correctly and button is enabled when name is not empty', () => {
    render(
      <CreateBlueprintModal
        open={true}
        setOpen={null}
        blueprintItems={exampleCreateNewBlueprint}
        resetBlueprintItems={null}
      />,
    );
    // check if header is rendered
    expect(screen.getByText('Create Blueprint')).toBeInTheDocument();
    // check if blueprint list is rendered
    expect(screen.getByText('Bandage Test')).toBeInTheDocument();
    expect(screen.getByText('Scissors Test')).toBeInTheDocument();
    // check if submit button is diabled
    expect(screen.getByTestId('create_blueprint_button')).toBeDisabled();
    // check if submit button is enabled when name is not empty
    fireEvent.change(screen.getByPlaceholderText('Enter Blueprint Name'), {
      target: { value: 'test' },
    });
    expect(screen.getByTestId('create_blueprint_button')).toBeEnabled();
  });

  it('renders empty message correctly when blueprint list is empty', () => {
    render(
      <CreateBlueprintModal
        open={true}
        setOpen={null}
        blueprintItems={[]}
        resetBlueprintItems={null}
      />,
    );
    // check that empty message is rendered
    expect(screen.queryByText('No items added!')).toBeInTheDocument();
    // check that submit button is disabled
    expect(screen.getByTestId('create_blueprint_button')).toBeDisabled();
    // check that submit buttob is disabled even when name is not empty
    fireEvent.change(screen.getByPlaceholderText('Enter Blueprint Name'), {
      target: { value: 'test' },
    });
    expect(screen.getByTestId('create_blueprint_button')).toBeDisabled();
  });

//   it('renders blueprint content correctly upon clicking', async () => {
//     render(
//       <CreateBlueprintModal
//         open={false}
//         setOpen={null}
//         blueprintItems={exampleCreateNewBlueprint}
//         resetBlueprintItems={null}
//       />,
//     );
//     const blueprints = screen.queryAllByTestId('item_accordion');
//     // check that none of the blueprint content is rendered
//     expect(
//       blueprints.every((ele) => ele.getAttribute('aria-expanded') == 'false'),
//     ).toBe(true);
//     // check that blueprint content is rendered upon clicking
//     await userEvent.click(blueprints[0]);
//     expect(
//       blueprints.some((ele) => ele.getAttribute('aria-expanded') == 'true'),
//     ).toBe(true);
//     expect(screen.getByText('Bandage Test')).toBeVisible();
//     expect(screen.getByText('Tape Test')).toBeVisible();
//     expect(screen.getByText('Test Fail Paper')).not.toBeVisible();
//     expect(screen.getByText('Test Fail Scissors')).not.toBeVisible();
//     const contentQty = screen.queryAllByTestId('blueprint_item_qty');
//     expect(contentQty.some((ele) => ele.textContent == 'test5')).toBe(true);
//     expect(contentQty.some((ele) => ele.textContent == 'test2')).toBe(true);
//   });
});
