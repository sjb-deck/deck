export const exampleBlueprint = {
  kits: [],
  blueprints: [
    {
      id: 5,
      name: 'Blueprint Test1',
      complete_content: [
        {
          item_id: 1,
          quantity: 'test5',
          name: 'Bandage Test',
        },
        {
          item_id: 5,
          quantity: 'test2',
          name: 'Tape Test',
        },
      ],
    },
    {
      id: 6,
      name: 'Blueprint Test2',
      complete_content: [
        {
          item_id: 2,
          quantity: 3,
          name: 'Scissors',
        },
      ],
    },
    {
      id: 7,
      name: 'Arts',
      complete_content: [
        {
          item_id: 6,
          quantity: 3,
          name: 'Test Fail Paper',
        },
        {
          item_id: 2,
          quantity: 2,
          name: 'Test Fail Scissors',
        },
      ],
    },
    {
      id: 8,
      name: 'Fries',
      complete_content: [
        {
          item_id: 1,
          quantity: 1,
          name: 'Bandage',
        },
        {
          item_id: 3,
          quantity: 1,
          name: 'Alcohol',
        },
        {
          item_id: 6,
          quantity: 14,
          name: 'Paper',
        },
      ],
    },
  ],
};

export const exampleCreateNewBlueprint = [
  { item_id: 1, quantity: 4, name: 'Bandage Test' },
  { item_id: 2, quantity: 2, name: 'Scissors Test' },
];
