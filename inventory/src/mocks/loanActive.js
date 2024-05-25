export const activeItemLoans = {
  results: [
    {
      id: 125,
      user: {
        id: 1,
        username: 'Jonas',
        email: '',
        extras: {
          profile_pic: 'user_dp/1.JPG',
          role: 'Developer',
          name: 'Jonas',
        },
      },
      order_items: [
        {
          id: 177,
          item_expiry: {
            id: 2,
            expiry_date: '2023-07-23',
            quantity: 19,
            archived: false,
            item: {
              id: 2,
              name: 'test expiry',
              type: 'General',
              unit: 'units',
              imgpic: '',
              total_quantity: 486,
              min_quantity: 0,
              is_opened: false,
            },
          },
          ordered_quantity: 1,
          returned_quantity: null,
        },
      ],
      loanee_name: 'test',
      due_date: '2023-11-17',
      loan_active: true,
      action: 'Withdraw',
      reason: 'loan',
      date: '2023-11-15T04:56:28.333180Z',
    },
    {
      id: 96,
      user: {
        id: 1,
        username: 'Jonas',
        email: '',
        extras: {
          profile_pic: 'user_dp/1.JPG',
          role: 'Developer',
          name: 'Jonas',
        },
      },
      order_items: [
        {
          id: 122,
          item_expiry: {
            id: 2,
            expiry_date: '2023-07-23',
            quantity: 19,
            archived: false,
            item: {
              id: 2,
              name: 'something',
              type: 'General',
              unit: 'units',
              imgpic: '',
              total_quantity: 486,
              min_quantity: 0,
              is_opened: false,
            },
          },
          ordered_quantity: 2,
          returned_quantity: null,
        },
      ],
      loanee_name: 'weemq',
      due_date: '2023-10-24',
      loan_active: true,
      action: 'Withdraw',
      reason: 'loan',
      date: '2023-10-24T11:07:28.354566Z',
    },
    {
      id: 90,
      user: {
        id: 3,
        username: 'cheehengk',
        email: 'cheeheng@sjabnhc.org',
        extras: {
          profile_pic: 'user_dp/red-panda-cute-25-2880x1800.jpg',
          role: 'Developer',
          name: 'Chee Heng',
        },
      },
      order_items: [
        {
          id: 112,
          item_expiry: {
            id: 1,
            expiry_date: null,
            quantity: 46,
            archived: false,
            item: {
              id: 1,
              name: 'cool item',
              type: 'General',
              unit: 'units',
              imgpic: '',
              total_quantity: 46,
              min_quantity: 0,
              is_opened: true,
            },
          },
          ordered_quantity: 12,
          returned_quantity: null,
        },
      ],
      loanee_name: 'ch',
      due_date: '2023-10-10',
      loan_active: true,
      action: 'Withdraw',
      reason: 'loan',
      date: '2023-10-10T15:14:00.874010Z',
    },
  ],
  num_pages: 1,
};

export const activeKitLoans = {
  count: 6,
  next: null,
  previous: null,
  results: [
    {
      id: 107,
      loan_info: {
        loanee_name: 'tester',
        due_date: '2024-12-30T00:00:00',
        return_date: null,
      },
      person: {
        id: 5,
        username: 'demo',
        email: '',
        extras: { profile_pic: '', role: 'Admin', name: 'demo' },
      },
      snapshot: [
        {
          item_expiry_id: 2,
          quantity: 4,
          item_expiry: {
            id: 2,
            expiry_date: '2023-07-23',
            quantity: 19,
            archived: false,
            item: {
              id: 2,
              name: 'test expiry',
              type: 'General',
              unit: 'units',
              imgpic: '',
              total_quantity: 486,
              min_quantity: 0,
              is_opened: false,
            },
          },
        },
        {
          item_expiry_id: 44,
          quantity: 2,
          item_expiry: {
            id: 44,
            expiry_date: '2023-08-24',
            quantity: 18,
            archived: false,
            item: {
              id: 4,
              name: 'something new1',
              type: 'General',
              unit: '3',
              imgpic: '',
              total_quantity: 64,
              min_quantity: 0,
              is_opened: false,
            },
          },
        },
      ],
      kit_name: 'Test Kit',
      type: 'LOAN',
      date: '2024-02-17T17:12:14.640765Z',
      order_id: null,
      kit: 30,
    },
    {
      id: 99,
      loan_info: {
        loanee_name: 'fs',
        due_date: '2024-02-05T00:00:00',
        return_date: null,
      },
      person: {
        id: 8,
        username: 'siwei',
        email: '',
        extras: { profile_pic: '', role: 'Developer', name: 'Siwei' },
      },
      snapshot: [
        {
          item_expiry_id: 1,
          quantity: 2,
          item_expiry: {
            id: 1,
            expiry_date: null,
            quantity: 46,
            archived: false,
            item: {
              id: 1,
              name: 'test item',
              type: 'General',
              unit: 'units',
              imgpic: '',
              total_quantity: 46,
              min_quantity: 0,
              is_opened: true,
            },
          },
        },
      ],
      kit_name: 'as',
      type: 'LOAN',
      date: '2024-02-05T14:26:09.026078Z',
      order_id: null,
      kit: 35,
    },
    {
      id: 98,
      loan_info: {
        loanee_name: 'fs',
        due_date: '2024-02-05T00:00:00',
        return_date: null,
      },
      person: {
        id: 8,
        username: 'siwei',
        email: '',
        extras: { profile_pic: '', role: 'Developer', name: 'Siwei' },
      },
      snapshot: [
        {
          item_expiry_id: 2,
          quantity: 1,
          item_expiry: {
            id: 2,
            expiry_date: '2023-07-23',
            quantity: 19,
            archived: false,
            item: {
              id: 2,
              name: 'test expiry',
              type: 'General',
              unit: 'units',
              imgpic: '',
              total_quantity: 486,
              min_quantity: 0,
              is_opened: false,
            },
          },
        },
        {
          item_expiry_id: 3,
          quantity: 1,
          item_expiry: {
            id: 3,
            expiry_date: '2033-07-13',
            quantity: 13,
            archived: false,
            item: {
              id: 2,
              name: 'test expiry',
              type: 'General',
              unit: 'units',
              imgpic: '',
              total_quantity: 486,
              min_quantity: 0,
              is_opened: false,
            },
          },
        },
        {
          item_expiry_id: 41,
          quantity: 1,
          item_expiry: {
            id: 41,
            expiry_date: '2023-08-19',
            quantity: 33,
            archived: false,
            item: {
              id: 2,
              name: 'test expiry',
              type: 'General',
              unit: 'units',
              imgpic: '',
              total_quantity: 486,
              min_quantity: 0,
              is_opened: false,
            },
          },
        },
        {
          item_expiry_id: 45,
          quantity: 1,
          item_expiry: {
            id: 45,
            expiry_date: '2024-08-19',
            quantity: 46,
            archived: false,
            item: {
              id: 4,
              name: 'something new1',
              type: 'General',
              unit: '3',
              imgpic: '',
              total_quantity: 64,
              min_quantity: 0,
              is_opened: false,
            },
          },
        },
      ],
      kit_name: 'Kit3',
      type: 'LOAN',
      date: '2024-02-05T14:26:08.913910Z',
      order_id: null,
      kit: 34,
    },
  ],
};
