import React, { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom";
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import '../css/main.css';
import { PaginatedItems } from "./Pagination";
import { OrderForm } from "./Order/OrderForm";
import styles from '../css/cart.module.css';

export const Cart = observer(() => {
  const location = useLocation();
  let isModalOpen = false;
  const locationState: unknown = location.state;
  if (locationState && typeof locationState === 'object' &&
    'isModalOpen' in locationState && typeof locationState.isModalOpen === 'boolean') {
    isModalOpen = locationState.isModalOpen;
  }

  const [promoInput,setPromoInput] = useState('');
  const [modalIsOpen, setModalIsOpen] = useState(isModalOpen);
  const navigate = useNavigate();

  const handlePromoChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
    setPromoInput(e.target.value.trim());
  }

  const handlePromoSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (cartStore.isPromoOK(promoInput)) {
      cartStore.addPromo(promoInput);
      setPromoInput('');
    }
  }

  const handleOrderFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const minDelay = 3000;
    const maxDelay = 5000;
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
    setTimeout(() => {
      cartStore.clear();
      navigate("/");
    }, randomDelay);
  }

  interface IBackdropProps {
    onClose?: () => void;
  }

  const Backdrop = (props: IBackdropProps) => {
    return (
      <div className="backdrop" onClick={props.onClose}></div>
    );
  };

  return (
    <div>
      {(cartStore.totalItems > 0) &&
      <div className="p-5 flex flex-row flex-nowrap justify-around items-center">
        <div className="flex flex-col">
          <div className="flex font-bold h-18 p-2 justify-between items-center">
            <p>Goods in cart</p>
          </div>
          <div id='container'>
            <PaginatedItems itemsPerPage={3} />
          </div>
        </div>
        <div  className='border p-4 flex flex-col justify-center gap-3 pt-7'>
          <p className = 'font-bold h-18'>Summary</p>
          <div className={ (cartStore.totalPrice == cartStore.finalPrice) ? styles.totalPrice : styles.totalPriceCrossed }>
            Total price: ${cartStore.totalPrice}
          </div>
          {(cartStore.totalPrice !== cartStore.finalPrice) &&
            <div className={styles.totalPrice}>Final price (with applied promocodes): ${cartStore.finalPrice}</div>
          }
          <div>Items: {cartStore.totalItems}</div>
          {(cartStore.totalPrice !== cartStore.finalPrice) &&
          <div className=''>
            <p className="font-bold">Applied promocodes</p>
            <div className="flex flex-col gap-3">
              { Array.from(cartStore.promos).map((promo) =>
                <div key={promo} className="flex justify-between items-center">
                  <p>{cartStore.showPromo(promo)}</p>
                  <button className='button button-buy'
                    onClick={() => cartStore.removePromo(promo)}>
                      remove promo
                  </button>
                </div>)
              }
            </div>
          </div>
          }
          <div>available promos: NOWAR (15%), NEWYEAR (10%), RSSCHOOL (5%)</div>
          <form autoComplete="off" onSubmit={handlePromoSubmit} >
            <input type='text'className="form-input w-full" id='promo-input' placeholder="enter promocode"
              value={promoInput} onChange={handlePromoChange}
            />
            {cartStore.isPromoOK(promoInput) &&
              <div className="border p-3 flex justify-between items-center">
                <p>{`${cartStore.showPromo(promoInput)}`}</p>
                <button className='button button-buy' type="submit">
                  apply promo
                </button>
              </div>
            }
          </form>
          <div>
            <button className='button button-buy' onClick={() => setModalIsOpen(true)}>
              Order now
            </button>
          </div>
        </div>
      </div>
      }
      {(cartStore.totalItems === 0) &&
        <div className="text-center text-bold text-6xl">The cart is empty</div>
      }
      {modalIsOpen &&
        <>
          <Backdrop onClose={() => setModalIsOpen(false)} />
          <OrderForm onSubmit={handleOrderFormSubmit}/>
        </>
      }
    </div>
  )
})
