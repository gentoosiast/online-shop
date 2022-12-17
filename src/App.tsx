import React from "react";
import { Header } from './components/Header';
import { OrderForm } from './components/Order/OrderForm';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IItem } from './types/IItem'; // TODO: temporary hack

export function App() {
  return (
    <>
      <Header />
      <div className="max-w-xs m-auto text-center text-emerald-700">
        Welcome aboard, best teammate on the planet Earth 🤗
      </div>
      <OrderForm />
    </>
  );
}
