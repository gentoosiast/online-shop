import React, { useEffect, useState } from "react"
import { ItemCardCart } from "./ItemCardCart"
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import ReactPaginate from 'react-paginate';
import '../css/main.css';
import { PaginatedItems } from "./Pagination"

export const Cart = observer(() => {
  const [promoInput,setPromoInput] = useState('');

  const handlePromoChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    setPromoInput(e.target.value);
    cartStore.addPromo(e.target.value.trim())
  }

  return (
    <div>
      {Boolean(cartStore.totalItems) &&
      <div className="p-5 flex flex-row flex-nowrap justify-around items-center">
        <div className="flex flex-col">
          <div className="flex font-bold h-18 p-2 justify-between items-center">
            <p>Goods in cart</p>
          </div>
          <div id = 'container'>
            <PaginatedItems itemsPerPage = {3}/>
          </div>
          {/* {Array.from(cartStore.items).map(el => <ItemCardCart key={el[0].id} item={el[0]} amt={el[1]}></ItemCardCart>)} */}
        </div>
        <div  className='border p-4 flex flex-col justify-center gap-3 pt-7'>
            <p className = 'font-bold h-18'>Summary</p>
            <div>Total price: ${cartStore.totalPrice}</div>
            <div>Items: {cartStore.totalItems}</div>
            <div>available promos: NOWAR (15%), NEWYEAR (10%), RSSCHOOL (5%)</div>
            <input type='text'className="form-input" id='promo-input' placeholder="enter promocode"
            value={promoInput} onChange={handlePromoChange}
            ></input>
            <label htmlFor="promo-input">Final price: ${cartStore.finalPrice}</label>
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
