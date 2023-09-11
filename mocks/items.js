export const exampleItem = {
  id: 1,
  expiry_dates: [
    {
      id: 1,
      expiry_date: '2023-06-30',
      quantity: 1,
      archived: false,
    },
    {
      id: 2,
      expiry_date: '2023-06-06',
      quantity: 1,
      archived: false,
    },
  ],
  name: 'Scissors',
  type: 'General',
  unit: 'pair',
  imgpic: '/uploaded/item_img/example.png',
  total_quantity: 2,
  min_quantity: 0,
};

export const exampleItemNoExpiry = {
  id: 1,
  expiry_dates: [
    {
      id: 1,
      expiry_date: null,
      quantity: 1,
      archived: false,
    },
  ],
  name: 'No Expiry Object',
  type: 'General',
  unit: 'pair',
  imgpic: '/uploaded/item_img/example.png',
  total_quantity: 1,
  min_quantity: 0,
};

const mockProperties = {
  unit: 'Roll',
  imgpic: null,
  total_quantity: 9,
  min_quantity: 0,
  expiry_dates: [
    {
      id: 44,
      expiry_date: '2023-07-29',
      quantity: 9,
      archived: false,
    },
  ],
};

export const mockItems = [
  {
    id: 70,
    name: 'Triangular',
    type: 'Bandages',
    ...mockProperties,
  },
  {
    id: 71,
    name: 'Compression',
    type: 'Bandages',
    ...mockProperties,
  },
  {
    id: 72,
    name: 'Scissors',
    type: 'General',
    ...mockProperties,
  },
  {
    id: 73,
    name: 'Gauze',
    type: 'General',
    ...mockProperties,
  },
  {
    id: 74,
    name: 'Saline',
    type: 'Solution',
    ...mockProperties,
  },
  {
    id: 75,
    name: 'Alcohol',
    type: 'Solution',
    ...mockProperties,
  },
];
