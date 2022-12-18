/* eslint-disable @typescript-eslint/no-unsafe-call */
import React, { useEffect, useState } from 'react';
import { IItem } from '../types/IItem';
import styles from '../css/sidebar.module.css';
import Nouislider from "nouislider-react";
import "nouislider/distribute/nouislider.css";

export const Sidebar = () => {
//temporary lines start - to get items
    const [items, setItems] = useState<IItem[]>([])
    const [err, setErr] = useState(false)
    const fetchItems = () => {
      fetch('https://dummyjson.com/products?limit=30')
      .then((res: Response) =>res.json())
      .then((json) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
        setItems(json.products)
      })
      .catch(error => {
        setErr(true)
      })
    }

    useEffect(() => {
      fetchItems()
    }, [])
//temporary lines end

const category = [...new Set(items.map(el=> el.category))]
const brand = [...new Set(items.map(el=> el.brand))]
const prices = [Math.min(...items.map(el=> el.price)), Math.max(...items.map(el=> el.price))]
const stock = [Math.min(...items.map(el=> el.stock)), Math.max(...items.map(el=> el.stock))]
const calcAmt = (arg1: number, arg2: string) => {
  if (arg1 == 1) {
    return items.filter(el=> el.category == arg2).length
  }
  return items.filter(el=> el.brand == arg2).length
}

  return (
    <div className='w-fit'>
      <div className={styles.box}>
        <h3 className={styles.h3}>Category</h3>
        <div className={styles.items}>
          {category.map((el, i) =>
          <div key={i} className={styles.item}>
            <input type='checkbox' id={i.toString()} className={styles.checkbox}></input>
            <label htmlFor={i.toString()}>{el}</label>
            <span>{calcAmt(1, el)}/{calcAmt(1, el)}</span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Brand</h3>
        <div  className={styles.items}>
          {brand.map((el, i) =>
            <div key={i} className={styles.item}>
            <input type='checkbox' id={i.toString()} className={styles.checkbox}></input>
            <label htmlFor={i.toString()}>{el}</label>
            <span>{calcAmt(2, el)}/{calcAmt(2, el)}</span>
            </div>
          )}
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Price</h3>
        <div className={styles.minMax}>
          {prices.map((el, i) => <span key={i}>${el}</span>)}
          <div id='slider'></div>
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Stock</h3>
        <div className={styles.minMax}>
          {stock.map((el, i) => <span key={i}>{el}</span>)}
        </div>
      </div>
    </div>
  )
}

