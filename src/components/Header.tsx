import React from "react";
import logoImg from '../assets/logo.png';
import featherSprite from 'feather-icons/dist/feather-sprite.svg';

export function Header() {
  return (
    <header className="flex flex-row p-5 bg-blue-200 rounded-t-3xl">
      <div className="basis-1/4 flex items-center">
        <img src={logoImg} alt="Online Shop Logo" className="w-14 cursor-pointer" />
        <h2 className="font-bold text-xl cursor-pointer">Shop name</h2>
      </div>
      <input className="basis-1/2 form-input" type='text' placeholder="I'm looking for..." />
      <div className="basis-1/4 flex items-center justify-end gap-2">
        <button aria-label="Shopping Cart" type="button">
          <svg className="feather cart-icon">
            <use href={`${featherSprite}#shopping-bag`} />
          </svg>
        </button>
        <p>7 items</p>
        <p>$0</p>
      </div>
   </header>
  )
}
