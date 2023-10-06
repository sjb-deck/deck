export const mockWithdrawOrder = {
  id: 31,
  user: {
    id: 1,
    username: 'Jonas',
    email: '',
    extras: {
      profile_pic: '/uploaded/user_dp/IMG_2936.JPG',
      role: 'Developer',
      name: 'Jonas',
    },
  },
  order_items: [
    {
      id: 33,
      item_expiry: {
        id: 2,
        expiry_date: '2023-07-23',
        quantity: 45,
        archived: false,
        item: {
          id: 2,
          name: 'test expiry',
          type: 'General',
          unit: 'units',
          imgpic: null,
          total_quantity: 84,
          min_quantity: 0,
          is_opened: false,
        },
      },
      ordered_quantity: 3,
      returned_quantity: null,
    },
  ],
  action: 'Withdraw',
  reason: 'unserviceable',
  date: '2023-08-19T15:32:24.901300Z',
};

export const mockDepositOrder = {
  id: 45,
  user: {
    id: 7,
    username: 'clovis',
    email: '',
    extras: {
      profile_pic: null,
      role: 'Developer',
      name: 'Clovis',
    },
  },
  order_items: [
    {
      id: 48,
      item_expiry: {
        id: 1,
        expiry_date: null,
        quantity: 75,
        archived: false,
        item: {
          id: 1,
          name: 'test item',
          type: 'General',
          unit: 'units',
          imgpic: null,
          total_quantity: 75,
          min_quantity: 0,
          is_opened: true,
        },
      },
      ordered_quantity: 2,
      returned_quantity: null,
    },
  ],
  action: 'Deposit',
  reason: 'item_restock',
  date: '2023-08-27T04:31:14.106012Z',
};

export const mockLoanOrder = {
  id: 63,
  user: {
    id: 1,
    username: 'Jonas',
    email: '',
    extras: {
      profile_pic: '/uploaded/user_dp/IMG_2936.JPG',
      role: 'Developer',
      name: 'Jonas',
    },
  },
  order_items: [
    {
      id: 69,
      item_expiry: {
        id: 3,
        expiry_date: '2033-07-13',
        quantity: 16,
        archived: false,
        item: {
          id: 2,
          name: 'test expiry',
          type: 'General',
          unit: 'units',
          imgpic: null,
          total_quantity: 84,
          min_quantity: 0,
          is_opened: false,
        },
      },
      ordered_quantity: 2,
      returned_quantity: 0,
    },
    {
      id: 70,
      item_expiry: {
        id: 1,
        expiry_date: null,
        quantity: 75,
        archived: false,
        item: {
          id: 1,
          name: 'test item',
          type: 'General',
          unit: 'units',
          imgpic: null,
          total_quantity: 75,
          min_quantity: 0,
          is_opened: true,
        },
      },
      ordered_quantity: 1,
      returned_quantity: 1,
    },
  ],
  loanee_name: 'test',
  due_date: '2023-08-28T00:00:00Z',
  return_date: '2023-09-06T19:06:08.167142Z',
  loan_active: false,
  action: 'Withdraw',
  reason: 'loan',
  date: '2023-08-28T15:16:23.146238Z',
};
