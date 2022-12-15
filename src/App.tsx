import React, { useEffect, useState } from "react";
import { OrderForm } from './components/Order/OrderForm';
import { Footer } from './components/footer'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { IItem } from './types/IItem'; // TODO: temporary hack
import { ItemCard } from "./components/ItemCard";

// const items = [
//   {
//     id: 1,
//     title: "iPhone 9",
//     description: "An apple mobile which is nothing like apple",
//     price: 549,
//     discountPercentage: 12.96,
//     rating: 4.69,
//     stock: 94,
//     brand: "Apple",
//     category: "smartphones",
//     thumbnail: "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
//     images: [
//     "https://i.dummyjson.com/data/products/1/1.jpg",
//     "https://i.dummyjson.com/data/products/1/2.jpg",
//     "https://i.dummyjson.com/data/products/1/3.jpg",
//     "https://i.dummyjson.com/data/products/1/4.jpg",
//     "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
//     ]
//     },
//     {
//       id: 2,
//       title: "iPhone X",
//       description: "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...",
//       price: 899,
//       discountPercentage: 17.94,
//       rating: 4.44,
//       stock: 34,
//       brand: "Apple",
//       category: "smartphones",
//       thumbnail: "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
//       images: [
//       "https://i.dummyjson.com/data/products/2/1.jpg",
//       "https://i.dummyjson.com/data/products/2/2.jpg",
//       "https://i.dummyjson.com/data/products/2/3.jpg",
//       "https://i.dummyjson.com/data/products/2/thumbnail.jpg"
//       ]
//       },
// ]

export function App() {
  const [items, setItems] = useState<IItem[]>([])
  const fetchItems = () => {
    fetch('https://dummyjson.com/products?limit=10')
    .then(res=>res.json())
    .then(json => {
      console.log(json.products[0])
      setItems(json.products)
    })
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <>
      <Header />
      <div className="max-w-xs m-auto text-center text-emerald-700">
        Welcome aboard, best teammate on the planet Earth 🤗
      </div>
      <OrderForm />
      {items.map(item => <ItemCard item={item} key={item.id}/>)}
      <Footer/>
    </>
  );
  // return (
  //   <div className="max-w-xs m-auto text-center text-emerald-700">
  //   {/* <FullNameInput/> */}
  //   <AllCards/>


  //   </div>
  // );
}
