import React from "react"
import { Link } from "react-router-dom";
import { IItem } from "../types/items"
import { cartStore } from "../storage/cart.store"
import { observer } from 'mobx-react-lite';
import { Image } from './Image';
import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import catPlaceholder from '../assets/cat-placeholder.svg';
import styles from '../css/cart.module.css';

interface IItemCardCart {
  number: number
  item: IItem
  amount: number
}

export const ItemCardCart = observer(({number, item, amount}: IItemCardCart) => {
  return (
    <div className='border p-4 w-full'>
      <div className="flex justify-between gap-2">
        <div>{number}</div>
        <Link to={`/item/${item.id}`} aria-label={`Open details page for ${item.title}`}>
          <div className="card-image w-32 h-32">
            <Image className="card-image-img" src={item.images[0]} alt={item.title} />
            <img className="card-image-placeholder" src={catPlaceholder} alt="cat placeholder" />
          </div>
        </Link>
        <div className="p-2">
          <p className="font-bold h-auto">{item.title}</p>
          <p className="h-auto">Brand: {item.brand}</p>
          <p className="h-auto">Category: {item.category}</p>
          <p className="h-auto">Discount: {item.discountPercentage}%</p>
          <p className="h-auto">Available: {item.stock}</p>
        </div>
        <div className="flex items-center">
          <button
            aria-label="remove one item of the same type from the shopping cart"
            onClick = {() => cartStore.removeOneItem(item.id)}>
            <svg className="feather minus-one">
              <use href={`${featherSprite}#minus-circle`} />
            </svg>
          </button>
          <p className="px-5">{amount}</p>
          <button
            className={(cartStore.isEnoughInStock(item.id)) ? styles.button_round : styles.button_round__inactive}
            aria-label="add one more item of the same type to the shopping cart"
            onClick = {() => cartStore.addItem(item)}>
            <svg className={`feather plus-one`}>
              <use href={`${featherSprite}#plus-circle`} />
            </svg>
          </button>
        </div>
        <div  className="flex items-center">
          <p className="font-bold">${item.price * amount}</p>
        </div>
        <button  className="flex" type="button"
          onClick = {() => cartStore.removeAllItems(item.id)}>
          <svg className="feather cart-icon">
            <use href={`${featherSprite}#x`} />
          </svg>
        </button>
      </div>
    </div>
  )
})
