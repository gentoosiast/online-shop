import React from "react";
import { OrderForm } from './components/Order/OrderForm';
import { Footer } from './components/footer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IItem } from './types/IItem'; // TODO: temporary hack
import { ItemDetails } from "./components/ItemDetailsPage"
import { FilterPage } from "./components/FilterPage"



const itemsss = [{
  id: 1,
  title: "iPhone 9",
  description: "An apple mobile which is nothing like apple",
  price: 549,
  discountPercentage: 12.96,
  rating: 4.69,
  stock: 94,
  brand: "Apple",
  category: "smartphones",
  thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
  images: [
  "https://i.dummyjson.com/data/products/1/1.jpg",
  "https://i.dummyjson.com/data/products/1/2.jpg",
  "https://i.dummyjson.com/data/products/1/3.jpg",
  "https://i.dummyjson.com/data/products/1/4.jpg",
  "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
  ]
},]


export function App() {
  return (
    <>
      <Header />
      <div className="max-w-xs m-auto text-center text-emerald-700">
        Welcome aboard, best teammate on the planet Earth 🤗
      </div>
      <OrderForm />
      {/* <AllCards url ={'https://dummyjson.com/products?limit=10'}/> */}
      <FilterPage/>
      <ItemDetails item = {itemsss[0]}/>
      <Footer/>
    </>
  );
}
