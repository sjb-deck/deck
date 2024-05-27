// src/mocks/handlers.js
import { rest } from 'msw';

import { Api } from '../../globals';
import { getUrlWithoutParams } from '../../utils';
import {
  exampleKit,
  exampleKitRestockOptions,
  mockBlueprints,
  mockItemList,
  mockKitRecipeData,
  mockKitsList,
  mockOrders,
  mockUser,
} from '../index';

export const handlers = [
  rest.get(Api['user'], (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockUser));
  }),

  rest.get(Api['items'], (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockItemList));
  }),

  rest.get(getUrlWithoutParams(Api['orders']), (req, res, ctx) => {
    const orders = new Array(5)
      .fill(mockOrders)
      .flat()
      .map((o, idx) => ({ ...o, id: idx + 100 }));
    return res(ctx.status(200), ctx.json(orders));
  }),

  rest.post(Api['importItems'], (req, res, ctx) => {
    return res(ctx.status(201), ctx.json(mockItemList));
  }),

  rest.get(Api['exportItems'], (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set('Content-Disposition', 'attachment; filename=items.csv'),
      ctx.set('Content-Type', 'text/csv'),
      ctx.json([]),
    );
  }),

  rest.get(Api['kits'], (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ kits: mockKitsList, blueprints: mockBlueprints }),
    );
  }),

  rest.get(getUrlWithoutParams(Api['kitRecipe']), (req, res, ctx) => {
    return res(ctx.json(mockKitRecipeData));
  }),
  rest.post(Api['createKit'], (req, res, ctx) => {
    return res(ctx.status(201), ctx.json({}));
  }),

  rest.get(getUrlWithoutParams(Api['kit']), (req, res, ctx) => {
    return res(ctx.json(exampleKit));
  }),

  rest.get(Api['kitRestockOptions'], (req, res, ctx) => {
    return res(ctx.json(exampleKitRestockOptions));
  }),

  rest.post(Api['submitKitOrder'], (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({}));
  }),
];
