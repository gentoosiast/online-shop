import React from "react"
import { Link } from "react-router-dom";
import { cartStore } from "../storage/cart.store"
import { observer } from 'mobx-react-lite';
import { Image } from './Image';
import { IItem } from "../types/items"
import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import ThrashIcon from "../assets/Delete.svg?component";
import catPlaceholder from '../assets/cat-placeholder.svg';
import styles from '../css/cart.module.css';

interface IItemCardCart {
  number: number
  item: IItem
  amount: number
}

export const ItemCardCart = observer(({number, item, amount}: IItemCardCart) => {
  return (
    <div className='px-8 py-2 w-full bg-gray-100 my-3'>
      <div className="flex justify-between items-center gap-4">
        <div className="w-6">{number}</div>
        <Link to={`/item/${item.id}`} aria-label={`Открыть страницу с подробной информацией о товаре ${item.title}`}>
          <div className="card-image w-32 h-32 hover:scale-105 transition-transform duration-150">
            <Image className="card-image-img" src={item.images[0]} alt={`Изображение товара ${item.title}`} />
            <img className="card-image-placeholder" src={catPlaceholder} alt="" />
          </div>
        </Link>
        <div className="descr p-2 w-80">
          <p className="font-bold h-auto">{item.title}</p>
          <div>
            <span className="text-gray-500">Категория: </span>
            <span>{item.category}</span>
          </div>
          <div>
            <span className="text-gray-500">Бренд: </span>
            <span>{item.brand}</span>
          </div>
          <div>
            <span className="text-gray-500">В наличии: </span>
            <span>{item.stock} шт.</span>
          </div>
          <div>
            <span className="text-gray-500">Скидка: </span>
            <span>{item.discountPercentage}%</span>
          </div>
        </div>
        <div className="add-remove flex items-center w-40">
          <button
            aria-label="Удалить один такой товар из корзины"
            onClick = {() => cartStore.removeOneItem(item.id)}>
            <svg className="feather minus-one bg-green-600 rounded-full text-white transition-colors duration-300 hover:bg-green-400">
              <use href={`${featherSprite}#minus-circle`} />
            </svg>
          </button>
          <p className="px-5">{amount}</p>
          <button
            className={(cartStore.isEnoughInStock(item.id)) ? styles.button_round : styles.button_round__inactive}
            aria-label="Добавить еще один такой товар в корзину"
            onClick = {() => cartStore.addItem(item)}>
            <svg className="feather plus-one bg-green-600 rounded-full text-white transition-colors duration-300 hover:bg-green-400">
              <use href={`${featherSprite}#plus-circle`} />
            </svg>
          </button>
        </div>
        <div  className="price flex items-center w-20">
          <p className="font-bold text-green-700">{item.price * amount} ₽</p>
        </div>
        <button  className="flex" type="button"
          onClick = {() => cartStore.removeAllItems(item.id)}>
          <ThrashIcon className={styles.delete_logo} id={item.id.toString()}/>
        </button>
      </div>
    </div>
  )
})
