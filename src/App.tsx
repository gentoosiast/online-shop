import React from "react";
import { Header } from './components/Header';
import { Footer } from './components/footer'
import { OrderForm } from './components/Order/OrderForm';
import { ItemDetails } from "./components/ItemDetailsPage"
import { FilterPage } from "./components/FilterPage"
import { Cart } from "./components/Cart"

export function App() {
  return (
    <>
      <Header />
      {/* <div className="max-w-xs m-auto text-center text-emerald-700">
        Welcome aboard, best teammate on the planet Earth 🤗
      </div> */}
      {/* <OrderForm /> */}
      <FilterPage url="https://dummyjson.com/products?limit=5" />
      <ItemDetails id={5} />
      <Cart></Cart>
      <Footer/>
    </>
  );
}
