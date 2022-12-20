import React from "react"
import { ItemCardCart } from "./ItemCardCart"
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import '../css/main.css'


export const Cart = observer(() => {

  return (
    <div>
      {Boolean(cartStore.totalItems) &&
      <div className="p-5 flex flex-row flex-nowrap justify-around items-center">
        <div className="flex flex-col">
          <div className="flex font-bold h-18 p-2 justify-between">
            <p>Goods in cart</p>
            <p>Items: {cartStore.totalItems} </p>
            <p className="bg-red-400">Page: to do</p>
          </div>
          {Array.from(cartStore.items).map(el => <ItemCardCart key={el[0].id} item={el[0]} amt={el[1]}></ItemCardCart>)}
        </div>
        <div  className='border p-4 flex flex-col justify-center gap-3 pt-7'>
            <p className = 'font-bold h-18'>Summary</p>
            <div>Total price: ${cartStore.totalPrice}</div>
            <div>Items: {cartStore.totalItems}</div>
            <div className="bg-red-400">Discount: to do</div>
            <div>
              <button className='button button-buy'
              >Order now
              </button>
            </div>
        </div>
      </div>
      }
      {(cartStore.items.size===0) &&
        <div className="text-center text-bold text-6xl">The cart is empty</div>
      }
    </div>
  )
})
