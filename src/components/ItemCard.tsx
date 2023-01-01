import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { IItem } from "../types/IItem";
import { ItemCardSize } from '../types/ItemCardSize';
import { Image } from './Image';
import catPlaceholder from '../assets/cat-placeholder.svg';

interface IItemsCardProps {
  item: IItem
  size: ItemCardSize;
}

export const ItemCard = observer(({item, size}: IItemsCardProps) => {
  return (
    <>
      {size === "Small" &&
          <div className={`flex flex-col gap-2 item-card w-1/6`}
          >
            <p className="font-bold h-14">{item.title}</p>
            <div className="card-image w-40 h-40">
              <Image className="card-image-img" src={item.images[0]} alt={item.title} />
              <img className="card-image-placeholder" src={catPlaceholder} alt="cat placeholder" />
              {/* <div className="card-image-placeholder-animation"></div> */}
            </div>

            <div className="flex flex-col gap-2">
              <button
                className={`button ${cartStore.isInCart(item.id) ? 'button-delete': 'button-add'}`}
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
              to={`/item/${item.id}`}className='button button-details' aria-label='Item Details'
              >
                details
            </Link>
            </div>
          </div>
      }

      {size === "Large" &&
        <div className={`flex flex-col gap-2 item-card w-1/4`}
        >
          <p className="font-bold h-14">{item.title}</p>
          <div className="card-image w-40 h-40">
            <Image className="card-image-img" src={item.images[0]} alt={item.title} />
            <div className="card-image-placeholder-animation"></div>
          </div>

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
