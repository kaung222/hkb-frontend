import { createBrowserRouter } from "react-router-dom";
import {
  CASH_BOOK,
  // DASHBOARD,
  HOME,
  INVENTORY,
  LOGIN,
  SERVICE,
  SHOP,
  USER,
} from "./constants/pathname.const.ts";
import Layout from "./components/Layout";
import DashBoardPage from "./pages/DashBoardPage";
import LoginPage from "./pages/LoginPage";
import ServicePage from "@/pages/ServicePage.tsx";
import CashBookPage from "./pages/CashBookPage.tsx";
import InventoryPage from "./pages/InventoryPage.tsx";
import ShopPage from "./pages/ShopPage.tsx";
import UserPage from "./pages/UserPage.tsx";

export const router = createBrowserRouter([
  {
    path: HOME,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <DashBoardPage />,
        path: HOME,
      },
      {
        element: <ServicePage />,
        path: SERVICE,
      },
      {
        element: <CashBookPage />,
        path: CASH_BOOK,
      },
      {
        element: <InventoryPage />,
        path: INVENTORY,
      },
      {
        element: <ShopPage />,
        path: SHOP,
      },
      {
        element: <UserPage />,
        path: USER,
      },
    ],
  },
  {
    path: LOGIN,
    element: <LoginPage />,
  },
  {
    path: "*",
    element: <div>404 : Not Found</div>,
  },
]);
