import "./css/main.css";
import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Root } from './components/Root';
import { ErrorPage } from './components/ErrorPage';
import { FilterPage, loader as filterLoader } from './components/FilterPage';
import { ItemDetails, loader as itemDetailsLoader } from './components/ItemDetailsPage';
import { CartPage } from './components/CartPage';

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
            element: <CartPage />
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
      <ReactQueryDevtools position="bottom-right" />
    </QueryClientProvider>
  </React.StrictMode>
);
