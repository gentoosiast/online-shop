import React from "react";
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import featherSprite from 'feather-icons/dist/feather-sprite.svg';

export const Header = observer(() => {
  return (
    <header className="flex flex-row p-5 bg-blue-200 rounded-t-3xl">
      <div className="basis-1/4 flex items-center">
        <Link to="/">
          <div className="flex items-center">
            <img src={logoImg} alt="Online Shop Logo" className="w-14 cursor-pointer" />
            <h2 className="font-bold text-xl cursor-pointer">Shop name</h2>
          </div>
        </Link>
      </div>
      <input className="basis-1/2 form-input" type='text' placeholder="I'm looking for..." />
      <div className="basis-1/4 flex items-center justify-end gap-2">
        <Link to="/cart" aria-label="Shopping Cart">
          <svg className="feather cart-icon">
            <use href={`${featherSprite}#shopping-bag`} />
          </svg>
        </Link>
        <p className="cart-items">{cartStore.totalItems} item(s)</p>
        <p className="cart-price">${cartStore.totalPrice}</p>
      </div>
   </header>
  )
});
