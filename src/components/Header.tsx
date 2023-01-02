import React from "react";
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { Link } from 'react-router-dom';
import logoImg from '../assets/logo.png';
import cartImg from "../assets/cart.svg"
// import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import styles from '../css/header.module.css';


export const Header = observer(() => {
  return (
    <header className={styles.header}>
      <div className={styles.header__shop}>
        <Link to="/">
          <div className={styles.link_shop}>
            <img src={logoImg} alt="Online Shop Logo" className={styles.logo} />
            <h2 className={styles.title}>Shop name</h2>
          </div>
        </Link>
      </div>
      <div className={styles.header_cart}>
        <Link to="/cart" className={styles.header__cart} aria-label="Shopping Cart">
          <div className="flex">
            {/* <svg className="feather cart-icon h-8">
              <use href={`${featherSprite}#shopping-bag`} />
            </svg> */}
            <img src={cartImg} alt="cart" className={styles.cart_icon} />
            <p className={styles.cart_items}>{cartStore.totalItems}</p>
          </div>
          <div className={styles.cart_price}>{cartStore.totalPrice}₽</div>
        </Link>
      </div>
   </header>
  )
});
