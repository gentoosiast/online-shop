import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { IItem } from "../types/IItem";
import { ItemCardSize } from '../types/ItemCardSize';
// import CartPlus from "../assets/cart_plus.svg?component"
// import CartMinus from "../assets/cart_minus.svg?component"
import cartPlus from "../assets/cart_plus.png";
import cartMinus from "../assets/cart_minus.png"
import styles from '../css/card.module.css';
import infoImg from "../assets/info.svg"
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface IItemsCardProps {
  item: IItem
  size: ItemCardSize;
}

export const ItemCard = observer(({item, size}: IItemsCardProps) => {
  return (
    <>
      {size === "Small" &&
          <div className={`item-card flex flex-col w-48`}
          >
            <div className={styles.title}>
              <p className="">{item.title}</p>
            </div>
            <div className={styles.mainImg}>
              <img src={item.images[0]} className='max-h-48 w-40 m-auto' alt={item.title}/>
            </div>
            <div className='flex justify-between font-bold w-40'>
              <span className="text-green-600">{item.price} ₽</span>
              <span className="text-red-600">-{item.discountPercentage}%</span>
            </div>
            <div className={styles.buttonsBox}>
              <button className='w-8' id ={(item.id*100).toString()}
                onClick={() => {
                  if (cartStore.isInCart(item.id)) {
                    cartStore.removeAllItems(item.id);
                  } else {
                    cartStore.addItem(item);
                  }
                }}
                >
                  {cartStore.isInCart(item.id) && <img src={cartMinus} alt='cart-remove' className={styles.cardRemove}/>}
                  {!cartStore.isInCart(item.id) && <img src={cartPlus} alt='cart-add' className={styles.cardAdd}/>}
              </button>
              <Tooltip anchorId={(item.id*100).toString()} content="добавить/удалить" place='bottom'/>
            <Link
              to={`/item/${item.id}`}className='' aria-label='Item Details'
              >
                <img src={infoImg} alt='cart-remove' id ={(item.id*1000).toString()} className={styles.info}/>
            </Link>
            <Tooltip anchorId={(item.id*1000).toString()} content="детали" place='bottom'/>
            </div>
          </div>
      }

      {size === "Large" &&
        <div className={`flex flex-col gap-2 item-card w-80`}
        >
          <div className={styles.titleLarge}>
              <p className="">{item.title}</p>
          </div>
          <div className={styles.mainImgLarge}>
              <img src={item.images[0]} className='max-h-80 w-80 m-auto' alt={item.title}/>
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
                {cartStore.isInCart(item.id) && <img src={cartMinus} alt='cart-remove' className={styles.cardRemove}/>}
                {!cartStore.isInCart(item.id) && <img src={cartPlus} alt='cart-add' className={styles.cardAdd}/>}
            </button>
            <Tooltip anchorId={(item.id*100).toString()} content="добавить/удалить" place='bottom'/>

            <Link
              to={`/item/${item.id}`}className='' aria-label='Item Details'
              >
                <img src={infoImg} alt='cart-remove' id ={(item.id*1000).toString()} className={styles.info}/>
            </Link>
            <Tooltip anchorId={(item.id*1000).toString()} content="детали" place='bottom'/>

          </div>
        </div>
      }
    </>
  )
});
