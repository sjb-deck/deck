import { screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

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
});
