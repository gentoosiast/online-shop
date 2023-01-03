import React from "react";
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { Link } from 'react-router-dom';
import CatIcon1 from '../assets/cat_walk_icon_.png';
import CatIcon2 from '../assets/cat_icon.png';
import CartImg from "../assets/cart.svg?component"
import styles from '../css/header.module.css';

export const Header = observer(() => {
  return (
    <header className={styles.header}>
      <div className={styles.header__shop}>
        <Link to="/" >
          <div className={styles.link_shop}>
            <div className={styles.logo}>
              <img src={CatIcon1} alt="Online Shop Logo" className={styles.logo1}/>
              <img src={CatIcon2} alt="Online Shop Logo" className={styles.logo2}/>
            </div>
            <h2 className={styles.title}>RedCat</h2>
          </div>
        </Link>
      </div>
      <div className={styles.header_cart}>
        <Link to="/cart" className={styles.header__cart} aria-label="Shopping Cart" >
          <div className="flex">
            <CartImg className={styles.cart_icon} />
            <p className={styles.cart_items}>{cartStore.totalItems}</p>
          </div>
          <div className={styles.cart_price}>{cartStore.totalPrice}₽</div>
        </Link>
      </div>
   </header>
  )
});
