export const exampleKitRecipe = [
  {
    item_id: 2,
    item_name: 'test expiry',
    current_quantity: 0,
    required_quantity: 4,
    missing_quantity: 4,
    item_options: [
      {
        item_expiry_id: 2,
        expiry_date: '2023-07-23',
        quantity: 25,
      },
      {
        item_expiry_id: 41,
        expiry_date: '2023-08-19',
        quantity: 2,
      },
      {
        item_expiry_id: 42,
        expiry_date: '2023-08-26',
        quantity: -10,
      },
      {
        item_expiry_id: 123,
        expiry_date: '2023-11-25',
        quantity: 45,
      },
      {
        item_expiry_id: 124,
        expiry_date: '2023-11-28',
        quantity: 333,
      },
      {
        item_expiry_id: 3,
        expiry_date: '2033-07-13',
        quantity: 15,
      },
    ],
    sufficient_stock: true,
  },
  {
    item_id: 4,
    item_name: 'something new1',
    current_quantity: 0,
    required_quantity: 2,
    missing_quantity: 2,
    item_options: [
      {
        item_expiry_id: 44,
        expiry_date: '2023-08-24',
        quantity: 23,
      },
      {
        item_expiry_id: 45,
        expiry_date: '2024-08-19',
        quantity: 47,
      },
    ],
    sufficient_stock: true,
  },
];

export const exampleKitBlueprint = [
  {
    id: 2,
    name: 'test expiry',
    required_quantity: 4,
  },
  {
    id: 4,
    name: 'something new1',
    required_quantity: 2,
  },
];

export const mockKitRecipeData = [
  {
    item_id: 1,
    item_name: 'test item',
    current_quantity: 0,
    required_quantity: 2,
    missing_quantity: 2,
    item_options: [
      {
        item_expiry_id: 1,
        expiry_date: null,
        quantity: 54,
      },
    ],
    sufficient_stock: true,
  },
  {
    item_id: 5,
    item_name: 'something new 3',
    current_quantity: 0,
    required_quantity: 7,
    missing_quantity: 7,
    item_options: [
      {
        item_expiry_id: 46,
        expiry_date: '2023-09-06',
        quantity: 1,
      },
      {
        item_expiry_id: 47,
        expiry_date: '2023-09-28',
        quantity: 1,
      },
    ],
    sufficient_stock: false,
  },
  {
    item_id: 10,
    item_name: 'wdqwd',
    current_quantity: 0,
    required_quantity: 9,
    missing_quantity: 9,
    item_options: [
      {
        item_expiry_id: 52,
        expiry_date: null,
        quantity: 219,
      },
    ],
    sufficient_stock: true,
  },
];
