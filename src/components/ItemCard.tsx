import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { Image } from './Image';
import { IItem, ItemCardSize } from "../types/items";
import CartRemoveIcon from "../assets/cart-remove.svg?component";
import CartAddIcon from "../assets/cart-add.svg?component";
import InfoIcon from "../assets/info.svg?component";
import catPlaceholder from '../assets/cat-placeholder.svg';
import styles from '../css/card.module.css';

interface IItemsCardProps {
  item: IItem
  size: ItemCardSize;
}

export const ItemCard = observer(({item, size}: IItemsCardProps) => {
  return (
    <>
      {size === "Small" &&
        <Link to={`/item/${item.id}`} aria-label='Item Details'>
          <div className={`${styles.itemCard} flex flex-col w-48`}>
            <div className={styles.title}>
              <p className="">{item.title}</p>
            </div>
            <div className={`card-image ${styles.mainImg}`}>
              <Image className="card-image-img" src={item.images[0]} alt={`Изображение товара ${item.title}`}/>
              <img className="card-image-placeholder" src={catPlaceholder} alt="" />
            </div>
            <div className='flex justify-between font-bold w-40'>
              <span className="text-green-600">{item.price} ₽</span>
              <span className="text-red-600">-{item.discountPercentage}%</span>
            </div>
            <div className={styles.buttonsBox}>
              <button className='w-8' id ={(item.id*100).toString()}
                aria-label={
                  cartStore.isInCart(item.id) ? "Удалить товар из корзины" : "Добавить товар в корзину"
                }
                onClick={(event) => {
                  event.preventDefault();
                  if (cartStore.isInCart(item.id)) {
                    cartStore.removeAllItems(item.id);
                  } else {
                    cartStore.addItem(item);
                  }
                }}
                >
                  {cartStore.isInCart(item.id) && <CartRemoveIcon className={styles.cartRemove}/>}
                  {!cartStore.isInCart(item.id) && <CartAddIcon className={styles.cartAdd}/>}
              </button>
              <button aria-label='Подробная информация о товаре'>
                <InfoIcon className={styles.info} />
              </button>
            </div>
          </div>
        </Link>
      }

      {size === "Large" &&
        <Link to={`/item/${item.id}`} aria-label='Подробная информация о товаре'>
          <div className={`${styles.itemCard} flex flex-col gap-2 w-80`}>
            <div className={styles.titleLarge}>
              <p className="">{item.title}</p>
            </div>
            <div className={`card-image ${styles.mainImgLarge}`}>
              <Image className='card-image-img' src={item.images[0]} alt={item.title} />
              <img className="card-image-placeholder" src={catPlaceholder} alt="" />
            </div>
            <div className='text-sm'>
              <div className='flex justify-between font-bold w-64 text-lg'>
                <span className="text-green-600">{item.price} ₽</span>
                <span className="text-red-600">-{item.discountPercentage}%</span>
              </div>
                <div>
                  <span className="text-gray-500">Категория: </span>
                  <span>{item.category}</span>
                </div>
                <div>
                  <span className="text-gray-500">Бренд: </span>
                  <span>{item.brand}</span>
                </div>
              <div>
                <span className="text-gray-500">Рейтинг: </span>
                <span>{item.rating}</span>
              </div>
              <div>
                <span className="text-gray-500">В наличии: </span>
                <span>{item.stock} шт.</span>
              </div>
            </div>

            <div className={styles.buttonsBoxLarge}>
              <button className='w-8' id ={(item.id*100).toString()}
                onClick={() => {
                  if (cartStore.isInCart(item.id)) {
                    cartStore.removeAllItems(item.id);
                  } else {
                    cartStore.addItem(item);
                  }
                }}
                >
                  {cartStore.isInCart(item.id) && <CartRemoveIcon className={styles.cartRemove}/>}
                  {!cartStore.isInCart(item.id) && <CartAddIcon className={styles.cartAdd}/>}
              </button>
              <button aria-label='Подробная информация о товаре'>
                <InfoIcon className={styles.info} />
              </button>
            </div>
          </div>
        </Link>
      }
    </>
  )
});
