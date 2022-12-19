import React, { useEffect, useState } from 'react';
import { IItem } from '../types/IItem';
import styles from '../css/sidebar.module.css';
import { IDataParams } from './FilterPage';
import { Slider } from "./Slider"

interface ISidebarProps {
  items: IItem []
  onCheck: (type: string, el: string)=> void;
  params: IDataParams
}

export const Sidebar = ({items, onCheck, params}: ISidebarProps) => {

const pricesMinMax = [Math.min(...items.map(el=> el.price)), Math.max(...items.map(el=> el.price))]
const stockMinMax = [Math.min(...items.map(el=> el.stock)), Math.max(...items.map(el=> el.stock))]
const calcAmt = (arg1: number, arg2: string) => {
  if (arg1 == 1) {
    return items.filter(el=> el.category == arg2).length
  }
  return items.filter(el=> el.brand == arg2).length
}

const handleClick = (type: string, el:string) => {
  onCheck(type, el);
}

  return (
    <div className='w-fit'>
      <div className={styles.box}>
        <h3 className={styles.h3}>Category</h3>
        <fieldset className={styles.items}>
          {params.categories.map((el, i) =>
          <div key={i} className={styles.item} onClick={()=>handleClick('categories', el)}>
            <input type='checkbox' id={'1'+i.toString()} className={styles.checkbox} onClick={(e)=>e.stopPropagation()}></input>
            <label htmlFor={'1'+i.toString()}>{el}</label>
            <span>({calcAmt(1, el)})</span>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Brand</h3>
        <fieldset  className={styles.items}>
          {params.brands.map((el, i) =>
            <div key={i} className={styles.item} onClick={()=>handleClick('brands', el)}>
            <input type='checkbox' id={'2'+i.toString()} className={styles.checkbox} onClick={(e)=>e.stopPropagation()}></input>
            <label htmlFor={'2'+i.toString()}>{el}</label>
            <span>({calcAmt(2, el)})</span>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Price</h3>
        <div className={styles.minMax}>
          {pricesMinMax.map((el, i) => <input type='number' placeholder = {`${el}`} key={i} className='form-input w-44'
          ></input>)}
        </div>
        <div id='slider'>
            <Slider min = {pricesMinMax[0]} max = {pricesMinMax[1]}></Slider>
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Stock</h3>
        <div className={styles.minMax}>
          {stockMinMax.map((el, i) => <input type='number' placeholder = {`${el}`} key={i} className='form-input w-44'
          ></input>)}
        </div>
        <div id='slider'>
            {/* <Slider></Slider> */}
        </div>
      </div>
    </div>
  )
}

