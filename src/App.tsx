import React from "react";
import { Header } from './components/Header';
import { Footer } from './components/footer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IItem } from './types/IItem'; // TODO: temporary hack
import { OrderForm } from './components/Order/OrderForm';
import { ItemDetails } from "./components/ItemDetailsPage"
import { FilterPage } from "./components/FilterPage"

export function App() {
  return (
    <>
      <Header />
      {/* <div className="max-w-xs m-auto text-center text-emerald-700">
        Welcome aboard, best teammate on the planet Earth 🤗
      </div> */}
      {/* <OrderForm /> */}
      <FilterPage url="https://dummyjson.com/products?limit=15" />
      {/* <ItemDetails id={5} /> */}
      <Footer/>
    </>
  );
}
