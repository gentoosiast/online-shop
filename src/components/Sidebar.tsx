import React, { useState } from 'react';
import { IItem } from '../types/IItem';
import styles from '../css/sidebar.module.css';
import "../css/main.css"
import { IFilters } from './FilterPage';
import { Slider } from "./Slider"

interface ISidebarProps {
  items: IItem []
  onCheck: (type: keyof IFilters, el: string)=> void;
  filters: IFilters
  itemsToRender: IItem []
  onReset: () => void
}
interface ICheckbox {
  [x: number]: boolean;
}

export const Sidebar = ({items, onCheck, filters, itemsToRender, onReset}: ISidebarProps) => {

const pricesMinMax = [Math.min(...items.map(el=> el.price)), Math.max(...items.map(el=> el.price))]
const stockMinMax = [Math.min(...items.map(el=> el.stock)), Math.max(...items.map(el=> el.stock))]
const calcAmt = (arr: IItem [], filterType: keyof IItem, el: string) => {
  return arr.filter(elem=> elem[filterType] === el).length;
}
const categoriesCheckboxes: ICheckbox = {...Array(filters.categories.length).fill(false)}
const brandsCheckboxes: ICheckbox = {...Array(filters.categories.length).fill(false)}
const [categoriesChecked, setCategoriesChecked] = useState(categoriesCheckboxes);
const [brandsChecked, setBrandsChecked] = useState(brandsCheckboxes);

const handleClick = (type: keyof IFilters, el:string, index: number) => {
  onCheck(type, el);
  if (type === 'categories') setCategoriesChecked(prev => ({...prev, [index]: !categoriesChecked[index]}))
  if (type === 'brands') setBrandsChecked(prev => ({...prev, [index]: !brandsChecked[index]}))
}

const handleReset = () => {
  onReset();
  setCategoriesChecked(categoriesCheckboxes);
  setBrandsChecked(brandsCheckboxes);
}

const [isCopied, setIsCopied] = useState(false);

const handleCopy = () => {
  setIsCopied(true);
  setTimeout(() => {
    setIsCopied(false);
  }, 1000);
}

  return (
    <div className='w-fit'>
      <div>
        <button className='button button-add' onClick={handleReset}>Reset filters</button>
        <button className={ (isCopied) ? 'button button-delete' : 'button button-add'}
        onClick={()=>{navigator.clipboard.writeText(location.href).then(() => {
          handleCopy();
          }, () => console.log('failed to copy'));
        }}>
          { (isCopied) ? 'Link copied!' : 'Copy link'}
          </button>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Category</h3>
        <fieldset className={styles.items}>
          {filters.categories.map((el, i) =>
          <div key={i} className={styles.item} >
            <label htmlFor={'1'+i.toString()} className={styles.label}>
            <input type='checkbox' id={'1'+i.toString()} className={styles.checkbox}
            onChange={()=>handleClick('categories', el, i)} checked={categoriesChecked[i]}
            ></input>
            {el}</label>
            <span>({calcAmt(itemsToRender, 'category', el)})</span>/
            <span>({calcAmt(items, 'category', el)})</span>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Brand</h3>
        <fieldset  className={styles.items}>
          {filters.brands.map((el, i) =>
            <div key={i} className={styles.item}>
            <label htmlFor={'2'+i.toString()}>
            <input type='checkbox' id={'2'+i.toString()} className={styles.checkbox}
            onChange={()=>handleClick('brands', el, i)}  checked={brandsChecked[i]}
            ></input>
            {el}</label>
            <span>({calcAmt(itemsToRender, 'brand', el)})</span>/
            <span>({calcAmt(items, 'brand', el)})</span>
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
            {/* <Slider min = {pricesMinMax[0]} max = {pricesMinMax[1]}></Slider> */}
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
