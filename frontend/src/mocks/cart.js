export const mockDepositCart = [
  {
    id: 10,
    expiry_dates: [
      {
        id: 10,
        expiry_date: null,
        quantity: 0,
        archived: false,
        item: {
          id: 1,
          name: 'test item',
          type: 'General',
          unit: 'units',
          imgpic: null,
          total_quantity: 0,
          min_quantity: 0,
          is_opened: true,
        },
      },
    ],
    name: 'test item',
    type: 'Deposit',
    unit: 'units',
    imgpic: null,
    total_quantity: 0,
    min_quantity: 0,
    is_opened: true,
    expiryId: 10,
    cartQuantity: 2,
  },
  {
    id: 4,
    expiry_dates: [
      {
        id: 44,
        expiry_date: '2023-08-24',
        quantity: 33,
        archived: false,
        item: {
          id: 4,
          name: 'something new1',
          type: 'General',
          unit: '3',
          imgpic: null,
          total_quantity: 88,
          min_quantity: 0,
          is_opened: false,
        },
      },
      {
        id: 45,
        expiry_date: '2024-08-19',
        quantity: 55,
        archived: false,
        item: {
          id: 4,
          name: 'something new1',
          type: 'General',
          unit: '3',
          imgpic: null,
          total_quantity: 88,
          min_quantity: 0,
          is_opened: false,
        },
      },
    ],
    name: 'something new1',
    type: 'Deposit',
    unit: '3',
    imgpic: null,
    total_quantity: 88,
    min_quantity: 0,
    is_opened: false,
    expiryId: 44,
    cartQuantity: 1,
  },
];

export const mockWithdrawCart = [
  {
    id: 2,
    expiry_dates: [
      {
        id: 2,
        expiry_date: '2023-07-23',
        quantity: 0,
        archived: false,
        item: {
          id: 2,
          name: 'test expiry',
          type: 'General',
          unit: 'units',
          imgpic: null,
          total_quantity: 36,
          min_quantity: 0,
          is_opened: false,
        },
      },
      {
        id: 3,
        expiry_date: '2033-07-13',
        quantity: 13,
        archived: false,
        item: {
          id: 2,
          name: 'test expiry',
          type: 'General',
          unit: 'units',
          imgpic: null,
          total_quantity: 36,
          min_quantity: 0,
          is_opened: false,
        },
      },
      {
        id: 41,
        expiry_date: '2023-08-19',
        quantity: 2,
        archived: false,
        item: {
          id: 2,
          name: 'test expiry',
          type: 'General',
          unit: 'units',
          imgpic: null,
          total_quantity: 36,
          min_quantity: 0,
          is_opened: false,
        },
      },
      {
        id: 42,
        expiry_date: '2023-08-26',
        quantity: -10,
        archived: false,
        item: {
          id: 2,
          name: 'test expiry',
          type: 'General',
          unit: 'units',
          imgpic: null,
          total_quantity: 36,
          min_quantity: 0,
          is_opened: false,
        },
      },
    ],
    name: 'test expiry',
    type: 'Withdraw',
    unit: 'units',
    imgpic: null,
    total_quantity: 36,
    min_quantity: 0,
    is_opened: false,
    expiryId: 3,
    cartQuantity: 1,
  },
  {
    id: 3,
    expiry_dates: [
      {
        id: 43,
        expiry_date: null,
        quantity: 2,
        archived: false,
        item: {
          id: 3,
          name: 'something new',
          type: 'General',
          unit: '3',
          imgpic: null,
          total_quantity: 2,
          min_quantity: 0,
          is_opened: false,
        },
      },
    ],
    name: 'something new',
    type: 'Withdraw',
    unit: '3',
    imgpic: null,
    total_quantity: 2,
    min_quantity: 0,
    is_opened: false,
    expiryId: 43,
    cartQuantity: 1,
  },
];