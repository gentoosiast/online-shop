import { IItem } from "../types/IItem";
import React, {useState} from 'react';
import { ReactDOM } from "react";

interface ProductProps {
  item: IItem
}

export function ItemCard ({item}: ProductProps) {
  const [addToCard, setAddToCard] = useState(false)

  const btnBgClassName = addToCard ? 'bg-red-400' : 'bg-blue-400';
  const btnClasses = ['py-2 px-4 border', btnBgClassName]

  return (
    <div className="border p-5 rounded flex flex-col items-center"
    >
      <p className="font-bold">{item.title}</p>
      <img src = {item.images[0]} className="w-50" alt={item.title}/>
      <div className="bg-blue-100">
        <p>Category: {item.category}</p>
        <p>Brand: {item.brand}</p>
        <p>Price: {item.price}</p>
        <p>Discount: {item.discountPercentage}%</p>
        <p>Rating: {item.rating}</p>
        <p>Stock: {item.stock}</p>
      </div>

      <button
        className={btnClasses.join(' ')}
        onClick={() => setAddToCard(prev => !prev)}
        >
          {addToCard ? 'remove from card' : 'add to card'}
      </button>

      <button
        className='py-2 px-4 border bg-blue-400'
        >
          Details
      </button>
    </div>
  )
}
