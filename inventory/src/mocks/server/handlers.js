// src/mocks/handlers.js
import { rest } from 'msw';

import {
  INV_API_EXPORT_ITEMS_URL,
  INV_API_IMPORT_ITEMS_URL,
  INV_API_ITEMS_URL,
  INV_API_KITS_URL,
  INV_API_ORDERS_URL,
  INV_API_USER_URL,
  INV_API_KIT_RECIPE,
  INV_API_CREATE_KIT,
} from '../../globals';
import {
  mockItemList,
  mockKitsList,
  mockOrders,
  mockUser,
  mockKitRecipeData,
  mockBlueprints,
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

  rest.get(INV_API_KITS_URL, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ kits: mockKitsList, blueprints: mockBlueprints }),
    );
  }),

  rest.get(`${INV_API_KIT_RECIPE}/10`, (req, res, ctx) => {
    return res(ctx.json(mockKitRecipeData));
  }),
  rest.post(INV_API_CREATE_KIT, (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({}));
  }),
];
