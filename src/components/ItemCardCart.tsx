import React from "react"
import { IItem } from "../types/IItem"
import { cartStore } from "../storage/cart.store"
import { observer } from 'mobx-react-lite';
import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import styles from '../css/cart.module.css';

interface IItemCardCart {
  number: number
  item: IItem
  amt: number
}

export const ItemCardCart = observer(({number, item, amt}: IItemCardCart) => {
  return (

      <div className='border p-4 w-full'>
          <div className="flex justify-between">
            <div>{number}</div>
            <img src={item.images[0]} className="max-h-32" alt={item.title}/>
            <div className="p-2">
              <p className="font-bold h-auto">{item.title}</p>
              <p className="h-auto">Brand: {item.brand}</p>
              <p className="h-auto">Category: {item.category}</p>
              <p className="h-auto">Discount: {item.discountPercentage}%</p>
              <p className="h-auto">Available: {item.stock}</p>
            </div>
            <div className="flex items-center">
              <button className={styles.button_round}
              onClick = {() => cartStore.removeOneItem(item)}>-</button>
              <p className="px-5">{amt}</p>
              <button
              className={(cartStore.isEnoughInStock(item)) ? styles.button_round: styles.button_round__inactive}
              onClick = {() => cartStore.addItem(item)}
              >+</button>
            </div>
            <div  className="flex items-center">
              <p className="font-bold">${item.price}</p>
            </div>
            <button  className="flex" type="button"
            onClick = {() => cartStore.removeAllItems(item)}>
              <svg className="feather cart-icon">
                <use href={`${featherSprite}#x`} />
              </svg>
            </button>
          </div>
    </div>
  )
})
