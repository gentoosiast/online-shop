import React, { useState } from "react"
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import '../css/main.css';
import { PaginatedItems } from "./Pagination";
import { OrderForm } from "./Order/OrderForm";
import styles from '../css/cart.module.css';

export const Cart = observer(() => {
  const [promoInput,setPromoInput] = useState('');

  const handlePromoChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    setPromoInput(e.target.value.trim());
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
            <div className={ (cartStore.totalPrice == cartStore.finalPrice) ? styles.totalPrice : styles.totalPriceCrossed}
            >Total price: ${cartStore.totalPrice}</div>
            {(cartStore.totalPrice !== cartStore.finalPrice) &&
              <div className={styles.totalPrice}>Total price: ${cartStore.finalPrice}</div>
              }
            <div>Items: {cartStore.totalItems}</div>
            {(cartStore.totalPrice !== cartStore.finalPrice) &&
              <div className=''>
                <p className="font-bold">Applied promo codes</p>
                <div className="flex flex-col gap-3">
                  {Array.from(cartStore.promos).map((el, i)=> <div key={i} className="flex justify-between items-center">
                    <p>{`${el.join(' - ')}%`}</p>
                    <button className='button button-buy'
                    onClick={()=>cartStore.removePromo(el)}>remove promo</button>
                    </div>)}
                </div>
              </div>
              }
            <div>available promos: NOWAR (15%), NEWYEAR (10%), RSSCHOOL (5%)</div>
            <input type='text'className="form-input" id='promo-input' placeholder="enter promocode"
            value={promoInput} onChange={handlePromoChange}
            ></input>
            {cartStore.isPromoOK(promoInput) &&
            <div className="border p-3 flex justify-between">
              <p>{`${cartStore.showPromo(promoInput).join(' - ')}%`}</p>
              <button className='button button-buy'
              onClick={()=>cartStore.addPromo(promoInput)}
              >apply promo</button>
            </div>}
            {/* <label htmlFor="promo-input">Final price: ${cartStore.finalPrice}</label> */}
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
