import React, {useState} from 'react';
import { IItem } from "../types/IItem";
import { ItemCardSize } from '../types/ItemCardSize';

interface IItemsCardProps {
  item: IItem
  size: ItemCardSize;
}

export function ItemCard ({item, size}: IItemsCardProps) {
  const [inCart, setInCart] = useState(false)

  return (
    <>
      {size === "Small" &&
          <div className={`flex flex-col gap-2 item-card w-1/6`}
          >
            <p className="font-bold h-14">{item.title}</p>
            <img src={item.images[0]} className="max-h-40" alt={item.title}/>

            <div className="flex flex-col gap-2">
              <button
                className={`button ${inCart ? 'button-delete': 'button-add'}`}
                onClick={() => setInCart(prev => !prev)}
                >
                  {inCart ? 'remove from cart' : 'add to cart'}
              </button>

              <button
                className='button button-details'
                >
                  details
              </button>
            </div>
          </div>
      }

      {size === "Large" &&
        <div className={`flex flex-col gap-2 item-card w-1/4`}
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
              className={`button ${inCart ? 'button-delete': 'button-add'}`}
              onClick={() => setInCart(prev => !prev)}
              >
                {inCart ? 'remove from cart' : 'add to cart'}
            </button>

            <button
              className='button button-details'
              >
                details
            </button>
          </div>
        </div>
      }
    </>
  )
}
