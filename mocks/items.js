export const exampleItem = {
  id: 1,
  expirydates: [
    {
      id: 1,
      expirydate: '2023-06-30',
      quantityopen: 1,
      quantityunopened: 1,
      archived: false,
      item: 1,
    },
    {
      id: 2,
      expirydate: '2023-06-06',
      quantityopen: 1,
      quantityunopened: 1,
      archived: false,
      item: 1,
    },
  ],
  name: 'Scissors',
  type: 'General',
  unit: 'pair',
  imgpic: '/uploaded/item_img/example.png',
  total_quantityopen: 2,
  total_quantityunopened: 2,
  min_quantityopen: 0,
  min_quantityunopened: 0,
};

export const exampleItemNoExpiry = {
  id: 1,
  expirydates: [],
  name: 'No Expiry Object',
  type: 'General',
  unit: 'pair',
  imgpic: '/uploaded/item_img/example.png',
  total_quantityopen: 2,
  total_quantityunopened: 2,
  min_quantityopen: 0,
  min_quantityunopened: 0,
};

const mockProperties = {
  unit: 'Roll',
  imgpic: null,
  total_quantityopen: 9,
  total_quantityunopened: 8,
  min_quantityopen: 0,
  min_quantityunopened: 0,
  expirydates: [
    {
      id: 44,
      expirydate: '2023-07-29',
      quantityopen: 9,
      quantityunopened: 8,
      archived: false,
      item: 70,
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
