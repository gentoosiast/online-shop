import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { IItem } from "../types/IItem";
import { ItemCardSize } from '../types/ItemCardSize';
import styles from '../css/placeholder.module.css'

interface IItemsCardProps {
  item: IItem
  size: ItemCardSize;
}

export const ItemCard = observer(({item, size}: IItemsCardProps) => {
  return (
    <>
      {size === "Small" &&
          <div className={`flex flex-col gap-2 item-card relative w-58 h-96`}
          >
            <div className="font-bold relative h-14 mt-3 min-h-[14] flex">
              <div className={styles.loadWraper}>
                <div className={styles.activity}></div>
              </div>
              <div className='z-30'>{item.title}</div>
            </div>
            <div className='w-54 h-40 relative flex overflow-hidden'>
              <div className='h-40 flex justify-center items-center z-30'>
                <img src={item.images[0]} className="max-h-40 block" alt={item.title}
                />
              </div>
              <div className={styles.loadWraper}>
                <div className={styles.activity}></div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className='w-54 relative flex overflow-hidden'>
                <button
                  className={`button w-54 h-10 z-30 ${cartStore.isInCart(item.id) ? 'button-delete': 'button-add'}`}
                  onClick={() => {
                    if (cartStore.isInCart(item.id)) {
                      cartStore.removeAllItems(item.id);
                    } else {
                      cartStore.addItem(item);
                    }
                  }}
                  >
                    {cartStore.isInCart(item.id) ? 'remove from cart' : 'add to cart'}
                </button>
                <div className={styles.loadWraper}>
                  <div className={styles.activity}></div>
                </div>
              </div>
              <div className='w-54 relative flex overflow-hidden'>
                <Link
                  to={`/item/${item.id}`}className='button button-details z-30' aria-label='Item Details'
                  >
                    details
                </Link>
                <div className={styles.loadWraper}>
                  <div className={styles.activity}></div>
                </div>
              </div>
            </div>
          </div>
      }

      {size === "Large" &&
        <div className={`flex flex-col gap-2 item-card w-72`}
        >
          <p className="font-bold h-14">{item.title}</p>
          <img src={item.images[0]} className="max-h-40" alt={item.title}/>
          <div>
            <p><span className="font-bold">Category:</span> {item.category}</p>
            <p><span className="font-bold">Brand:</span> {item.brand}</p>
            <p><span className="font-bold">Price:</span> {item.price}</p>
            <p><span className="font-bold">Discount:</span> {item.discountPercentage}%</p>
            <p><span className="font-bold">Rating:</span> {item.rating}</p>
            <p><span className="font-bold">Stock:</span> {item.stock}</p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              className={`button ${cartStore.isInCart(item.id) ? 'button-delete' : 'button-add'}`}
              onClick={() => {
                if (cartStore.isInCart(item.id)) {
                  cartStore.removeAllItems(item.id);
                } else {
                  cartStore.addItem(item);
                }
              }}
              >
                {cartStore.isInCart(item.id) ? 'remove from cart' : 'add to cart'}
            </button>

            <Link
              className='button button-details' aria-label='Item Details' to={`/item/${item.id}`}
              >
                details
            </Link>
          </div>
        </div>
      }
    </>
  )
});
