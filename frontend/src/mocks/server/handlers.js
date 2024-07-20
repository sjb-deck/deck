// src/mocks/handlers.js
import { http, HttpResponse } from 'msw';

import {
  exampleKit,
  exampleKitRestockOptions,
  mockBlueprints,
  mockItemList,
  mockKitRecipeData,
  mockKitsList,
  mockOrders,
} from '../';
import { Api } from '../../globals/api';
import { getUrlWithoutParams } from '../../utils';

export const handlers = [
  http.get(Api['items'], () => {
    return HttpResponse.json(mockItemList, { status: 200 });
  }),

  http.get(getUrlWithoutParams(Api['orders']), () => {
    const orders = new Array(5)
      .fill(mockOrders)
      .flat()
      .map((o, idx) => ({ ...o, id: idx + 100 }));
    return HttpResponse.json(orders, { status: 200 });
  }),

  http.post(Api['importItems'], () => {
    return HttpResponse.json(mockItemList, { status: 201 });
  }),

  http.get(Api['exportItems'], () => {
    return new HttpResponse('[]', {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment; filename=items.csv',
        'Content-Type': 'text/csv',
      },
    });
  }),

  http.get(Api['kits'], () => {
    return HttpResponse.json(
      { kits: mockKitsList, blueprints: mockBlueprints },
      { status: 200 },
    );
  }),

  http.get(getUrlWithoutParams(Api['kitRecipe']), () => {
    return HttpResponse.json(mockKitRecipeData);
  }),
  http.post(Api['createKit'], () => {
    return HttpResponse.json({}, { status: 201 });
  }),
  http.get(getUrlWithoutParams(Api['kit']), () => {
    return HttpResponse.json(exampleKit);
  }),
  http.get(Api['kitRestockOptions'], () => {
    return HttpResponse.json(exampleKitRestockOptions);
  }),
  http.post(Api['submitKitOrder'], () => {
    return HttpResponse.json({}, { status: 200 });
  }),
];
