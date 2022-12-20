import React from "react"
import { IItem } from "../types/IItem"
import { cartStore } from "../storage/cart.store"
import { observer } from 'mobx-react-lite';


interface IItemCardCart {
  item: IItem
  amt: number
}

export const ItemCardCart = observer(({item, amt}: IItemCardCart) => {
  return (

      <div className='border p-4 w-full'>
          <div className="flex justify-between">
            <img src={item.images[0]} className="max-h-32" alt={item.title}/>
            <div className="p-2">
              <p className="font-bold h-14 h-auto">{item.title}</p>
              <p className="h-14 h-auto">Brand: {item.brand}</p>
              <p className="h-14 h-auto">Category: {item.category}</p>
              <p className="h-14 h-auto">Discount: {item.discountPercentage}%</p>
              <p className="h-14 h-auto">Available: {item.stock}</p>
            </div>
            <div className="flex items-center">
              <button className="border rounded-full h-12 w-12"
              onClick = {() => cartStore.removeOneItem(item)}>-</button>
              <p className="px-5">{amt}</p>
              <button className="border rounded-full h-12 w-12"
              onClick = {() => cartStore.addItem(item)}
              >+</button>
            </div>
            <div  className="flex items-center">
              <p className="font-bold">${item.price}</p>
            </div>
          </div>



    </div>
  )
})
