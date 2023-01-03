import React, { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom";
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import '../css/main.css';
import { PaginatedItems } from "./Pagination";
import { OrderForm } from "./Order/OrderForm";
import styles from '../css/cart.module.css';
import { Input } from "@material-tailwind/react";
import catCart from "../assets/cart_cat.png"


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
      <div className="py-5 flex flex-row flex-nowrap items-start gap-12">
        <div className="flex flex-col">
          <div className="flex font-bold h-18 pb-6 justify-between items-center">
            <p className="text-xl">Корзина</p>
          </div>
          <div id='container'>
            <PaginatedItems />
          </div>
        </div>
        <div className='total flex flex-col justify-center gap-3 pt-24'>
          <p className = 'font-bold text-2xl p-3 border-b border-green-500'>Итого</p>
          <div className={ (cartStore.totalPrice == cartStore.finalPrice) ? styles.totalPrice : styles.totalPriceCrossed }>
            <p>Цена: </p>
            <p className="text-green-500">{cartStore.totalPrice} ₽</p>
          </div>
          {(cartStore.totalPrice !== cartStore.finalPrice) &&
            <div className={styles.totalPrice}>
              <p>Цена (с учетом промокодов): </p>
              <p className="text-green-500">{cartStore.finalPrice} ₽</p>
              </div>
          }
          <div className="flex justify-between">
            <p>Товары, </p>
            <p>{cartStore.totalItems} шт.</p>
          </div>
          {(cartStore.totalPrice !== cartStore.finalPrice) &&
          <div className=''>
            <p className="font-bold">Примененные промокоды: </p>
            <div className="flex flex-col gap-3">
              { Array.from(cartStore.promos).map((promo) =>
                <div key={promo} className="flex justify-between items-center text-green-500">
                  <p>{cartStore.showPromo(promo)}</p>
                  <button className='button button-buy'
                    onClick={() => cartStore.removePromo(promo)}>
                      удалить
                  </button>
                </div>)
              }
            </div>
          </div>
          }
          <div>
            <p>Доступные промокоды:</p>
            <p className="text-gray-500">NOWAR (15%), NEWYEAR (10%), RSSCHOOL (5%)</p>
          </div>
          <form autoComplete="off" onSubmit={handlePromoSubmit} >
            <Input type='text'className="form-input w-full" id='promo-input' size="lg" color='green' label="Введите промокод"
              value={promoInput} onChange={handlePromoChange}
            />
            {cartStore.isPromoOK(promoInput) &&
              <div className="border p-3 flex justify-between items-center">
                <p>{`${cartStore.showPromo(promoInput)}`}</p>
                <button className='button button-buy' type="submit">
                  Применить
                </button>
              </div>
            }
          </form>
          <div>
            <button className='button button-add' onClick={() => setModalIsOpen(true)}>
              Заказать
            </button>
          </div>
        </div>
      </div>
      }
      {(cartStore.totalItems === 0) &&
        <div className="text-center">
          <p className="text-center text-bold text-3xl ">Корзина пуста</p>
          <img src={catCart} alt="cat cart" className={styles.cat}/>
          <Link to="/" >
          <button className='button button-buy mb-20'>За покупками
          </button>
        </Link>
        </div>
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
