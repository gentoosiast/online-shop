import React from "react";
import { OrderForm } from './components/Order/OrderForm';
import { Footer } from './components/footer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IItem } from './types/IItem'; // TODO: temporary hack
import { AllCards } from "./components/ItemsFetch";

export function App() {
  return (
    <>
      <Header />
      <div className="max-w-xs m-auto text-center text-emerald-700">
        Welcome aboard, best teammate on the planet Earth 🤗
      </div>
      <OrderForm />
      <AllCards url ={'https://dummyjson.com/products?limit=10'}/>
      <Footer/>
    </>
  );
}
