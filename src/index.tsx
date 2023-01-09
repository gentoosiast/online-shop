import "./css/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Root } from './pages/Root';
import { ErrorPage } from './pages/ErrorPage';
import { FilterPage, loader as filterLoader } from './pages/FilterPage';
import { ItemDetails, loader as itemDetailsLoader } from './pages/ItemDetailsPage';
import { Cart } from './pages/CartPage';
import { info } from './utils/information';

const rootDiv = document.getElementById("root");
if (!rootDiv) {
  throw new Error("#root is not found");
}
if (!(rootDiv instanceof HTMLDivElement)) {
  throw new Error("#root is not HTMLDivElement");
}

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            index: true,
            element: <FilterPage />,
            loader: filterLoader(queryClient)
          },
          {
            path: "item/:itemId",
            element: <ItemDetails />,
            loader: itemDetailsLoader(queryClient)
          },
          {
            path: "cart",
            element: <Cart />
          }
        ]
      }
    ]
  }
]);

const root = ReactDOM.createRoot(rootDiv);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <ReactQueryDevtools position="bottom-right" /> */}
    </QueryClientProvider>
  </React.StrictMode>
);


info();
