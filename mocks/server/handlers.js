// src/mocks/handlers.js
import { rest } from 'msw';

import {
  INV_API_ITEMS_URL,
  INV_API_SUBMIT_ORDER_URL,
  INV_API_USER_URL,
} from '../../globals';
import { mockItems } from '../items';
import { mockUser } from '../user';

export const handlers = [
  rest.get(INV_API_USER_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUser));
  }),

  rest.get(INV_API_ITEMS_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockItems));
  }),

  rest.post(INV_API_SUBMIT_ORDER_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        // Mocked response after submitting an order
      }),
    );
  }),
];
