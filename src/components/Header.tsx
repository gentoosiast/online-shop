import React from "react";
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import CartSvg from '../assets/shopping-cart.svg?component';

export const Header = observer(() => {
  return (
    <header className="flex justify-between p-5 bg-blue-200 rounded-t-3xl">
      <div className="basis-1/4 flex items-center">
        <Link to="/">
          <div className="flex items-center">
            <img src={logoImg} alt="Online Shop Logo" className="w-14 cursor-pointer" />
            <h2 className="font-bold text-xl cursor-pointer">Shop name</h2>
          </div>
        </Link>
      </div>
      <div className="basis-1/4 flex items-center justify-end gap-2">
        <Link to="/cart" className="flex gap-2" aria-label="Shopping Cart">
          <CartSvg className="shopping-cart-icon" />
          <p className="cart-items">{cartStore.totalItems} item(s)</p>
          <p className="cart-price">${cartStore.totalPrice}</p>
        </Link>
      </div>
   </header>
  )
});
