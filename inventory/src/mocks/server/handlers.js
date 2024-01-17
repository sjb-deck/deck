// src/mocks/handlers.js
import { rest } from 'msw';

import {
  Api,
  INV_API_EXPORT_ITEMS_URL,
  INV_API_IMPORT_ITEMS_URL,
  INV_API_ITEMS_URL,
  INV_API_ORDERS_URL,
  INV_API_USER_URL,
} from '../../globals';
import { getUrlWithoutParams } from '../../utils';
import {
  exampleKit,
  exampleKitRestockOptions,
  mockItemList,
  mockOrders,
  mockUser,
} from '../index';

export const handlers = [
  rest.get(INV_API_USER_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUser));
  }),

  rest.get(INV_API_ITEMS_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockItemList));
  }),

  rest.get(INV_API_ORDERS_URL, (req, res, ctx) => {
    const orders = new Array(5)
      .fill(mockOrders)
      .flat()
      .map((o, idx) => ({ ...o, id: idx + 100 }));
    return res(ctx.status(200), ctx.json(orders));
  }),

  rest.post(INV_API_IMPORT_ITEMS_URL, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json(mockItemList));
  }),

  rest.get(INV_API_EXPORT_ITEMS_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set('Content-Disposition', 'attachment; filename=items.csv'),
      ctx.set('Content-Type', 'text/csv'),
      ctx.json([]),
    );
  }),
  rest.get(getUrlWithoutParams(Api['kit']), (req, res, ctx) => {
    return res(ctx.json(exampleKit));
  }),
  rest.get(Api['kitRestockOptions'], (req, res, ctx) => {
    return res(ctx.json(exampleKitRestockOptions));
  }),
];
