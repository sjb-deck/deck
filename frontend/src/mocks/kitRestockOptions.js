export const exampleKitRestockOptions = [
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
        quantity: 21,
      },
      {
        item_expiry_id: 41,
        expiry_date: '2023-08-19',
        quantity: 33,
      },
      {
        item_expiry_id: 42,
        expiry_date: '2023-08-26',
        quantity: 12,
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
        quantity: 12,
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
        quantity: 19,
      },
      {
        item_expiry_id: 45,
        expiry_date: '2024-08-19',
        quantity: 46,
      },
    ],
    sufficient_stock: true,
  },
];
