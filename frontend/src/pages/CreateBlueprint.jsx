import { Box, Button, ButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';

import {
  Footer,
  LoadingSpinner,
  NavBar,
  BlueprintItemTable,
  EmptyMessage,
  BlueprintFilter,
  ViewExistingBlueprintTable,
  CreateBlueprintModal,
} from '../components';
import { useItems, useBlueprint } from '../hooks/queries';

import '../globals/styles/inventoryBase.scss';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

export const CreateBlueprint = () => {
  const userData = useAuthUser();
  const { data: items, isLoading: itemsLoading } = useItems();
  const { data: blueprints, isLoading: blueprintsLoading } = useBlueprint();
  const [isCreateMode, setIsCreateMode] = useState(true);
  const [itemsToDisplay, setItemsToDisplay] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (!items) return;
    items.forEach((item) => {
      const i = {
        id: item.id,
        type: item.type,
        name: item.name,
        unit: item.unit,
        total_quantity: item.total_quantity,
        selectedQty: 0,
      };
      setItemsToDisplay((prevItems) => [...prevItems, i]);
    });
  }, [items, itemsLoading]);

  const handleModeChange = (mode) => {
    if (mode === 'Create') {
      setIsCreateMode(true);
    } else {
      setIsCreateMode(false);
    }
  };

  const handleResetBtnClick = () => {
    setItemsToDisplay((prevItems) => {
      return prevItems.map((item) => {
        return { ...item, selectedQty: 0 };
      });
    });
    setSelectedItems([]);
  };

  const handleCreateBtnClick = () => {
    setOpenModal(true);
  };

  const updateSelectedItems = (id, name, quantity) => {
    const index = selectedItems.findIndex((item) => item.id === id);
    if (index === -1) {
      const i = {};
      i.id = id;
      i.name = name;
      i.quantity = quantity;
      setSelectedItems((prevItems) => [...prevItems, i]);
    } else {
      selectedItems[index].quantity = quantity;
    }
    if (quantity === 0 || quantity === '') {
      setSelectedItems((prevItems) => {
        const newItems = prevItems.filter((item) => item.id !== id);
        return newItems;
      });
    }
  };

  return (
    <>
      <NavBar user={userData} />
      {itemsLoading ? (
        <div style={{ minHeight: '100vh' }}>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <CreateBlueprintModal
            open={openModal}
            setOpen={setOpenModal}
            blueprintItems={selectedItems}
            resetBlueprintItems={handleResetBtnClick}
          />
          <Box
            className='nav-margin-compensate'
            sx={{
              width: 1,
              minHeight: 0.8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <BlueprintFilter onFilterChange={handleModeChange} />
            {isCreateMode ? (
              <>
                <CreateBlueprintComponent
                  itemsToDisplay={itemsToDisplay}
                  updateSelectedItems={updateSelectedItems}
                />
                <ButtonGroup style={{ marginTop: '2rem' }}>
                  <Button
                    color='error'
                    onClick={handleResetBtnClick}
                    style={{
                      border: '0.5px solid',
                      marginRight: '5px',
                      borderRadius: '5px',
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    color='success'
                    onClick={handleCreateBtnClick}
                    style={{
                      border: '0.5px solid',
                      marginLeft: '5px',
                      borderRadius: '5px',
                    }}
                  >
                    Create
                  </Button>
                </ButtonGroup>
              </>
            ) : (
              <ViewBlueprintsComponent
                blueprintsLoading={blueprintsLoading}
                blueprints={blueprints['blueprints']}
              />
            )}
          </Box>
        </>
      )}
      <div style={{ padding: '5vh' }} />
      <Footer />
    </>
  );
};

const CreateBlueprintComponent = ({ itemsToDisplay, updateSelectedItems }) => {
  if (itemsToDisplay.length > 0) {
    return (
      <BlueprintItemTable
        items={itemsToDisplay}
        updateSelectedItems={updateSelectedItems}
      />
    );
  } else {
    return <EmptyMessage message='No items found' fullscreen={false} />;
  }
};

const ViewBlueprintsComponent = ({ blueprintsLoading, blueprints }) => {
  if (!blueprintsLoading && blueprints.length) {
    return <ViewExistingBlueprintTable items={blueprints} />;
  } else {
    return <EmptyMessage message='No blueprints found' fullscreen={false} />;
  }
};
