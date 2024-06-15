import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
import { Route, Routes } from 'react-router-dom';

import {
  URL_BASE_INV,
  URL_INV_ADD_ITEM,
  URL_INV_CART,
  URL_INV_ITEMS,
  URL_INV_KITS_ADD_BLUEPRINT,
  URL_INV_KITS_ADD_KIT,
  URL_INV_KITS_CART,
  URL_INV_KITS_INFO,
  URL_INV_KITS_LOAN_RETURN,
  URL_INV_KITS_RESTOCK,
  URL_INV_LOAN_RETURN,
  URL_INV_VIEW_ITEM_LIST,
  URL_INV_VIEW_KITS,
  URL_INV_VIEW_ORDERS_LOANS,
  URL_LOGIN,
  URL_ORDER_RECEIPT,
} from '../../globals/urls';
import {
  AddItem,
  InventoryIndex,
  ItemCart,
  ItemIndex,
  Login,
  ItemList,
  LoanReturn,
  AdminIndex,
  OrderReceipt,
  KitIndex,
  KitAdd,
  CreateBlueprint,
  KitCart,
  KitInfo,
  KitRestock,
  KitLoanReturn,
} from '../../pages';

export const IMSRoutes = () => {
  return (
    <Routes>
      <Route path={URL_LOGIN} element={<Login />} />
      <Route element={<AuthOutlet fallbackPath='/login' />}>
        <Route path={URL_BASE_INV} element={<InventoryIndex />} />
        {/* Item Routes */}
        <Route path={URL_INV_ITEMS} element={<ItemIndex />} />
        <Route path={URL_INV_CART} element={<ItemCart />} />
        <Route path={URL_INV_ADD_ITEM} element={<AddItem />} />
        <Route path={URL_INV_VIEW_ITEM_LIST} element={<ItemList />} />
        <Route path={URL_ORDER_RECEIPT} element={<OrderReceipt />} />
        {/* Kit Routes */}
        <Route path={URL_INV_VIEW_KITS} element={<KitIndex />} />
        <Route path={URL_INV_KITS_ADD_KIT} element={<KitAdd />} />
        <Route
          path={URL_INV_KITS_ADD_BLUEPRINT}
          element={<CreateBlueprint />}
        />
        <Route path={URL_INV_KITS_CART} element={<KitCart />} />
        <Route path={URL_INV_KITS_INFO} element={<KitInfo />} />
        <Route path={URL_INV_KITS_RESTOCK} element={<KitRestock />} />
        <Route path={URL_INV_KITS_LOAN_RETURN} element={<KitLoanReturn />} />
        {/* Shared Route */}
        <Route path={URL_INV_LOAN_RETURN} element={<LoanReturn />} />
        <Route path={URL_INV_VIEW_ORDERS_LOANS} element={<AdminIndex />} />
      </Route>
    </Routes>
  );
};
