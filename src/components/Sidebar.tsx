import React, { useEffect, useState } from 'react';
import { IItem } from '../types/IItem';
import styles from '../css/sidebar.module.css';
import "../css/main.css"
import { IFilters } from './FilterPage';
// import { Slider } from "./Slider"
import ReactSlider from 'react-slider';

export type ICheckboxFilters = Pick<IFilters, 'categories' | 'brands'>
export type ISliderFilters = Pick<IFilters, 'prices' | 'stock'>

interface ISidebarProps {
  items: IItem []
  onCheck: (type: keyof ICheckboxFilters, el: string)=> void;
  filters: IFilters
  itemsToRender: IItem []
  onReset: () => void
  onSliderChange: (type: keyof ISliderFilters, value: number[])=> void
  customFilters: IFilters
  minMaxPrice: number[]
}
interface ICheckbox {
  [x: number]: boolean;
}

export const Sidebar = ({items, onCheck, filters, itemsToRender, onReset, onSliderChange, customFilters, minMaxPrice}: ISidebarProps) => {

const calcAmount = (arr: IItem [], filterType: keyof IItem, el: string) => {
  return arr.filter(elem=> elem[filterType] === el).length;
}
const categoriesCheckboxes: ICheckbox = {...Array(filters.categories.length).fill(false)}
const brandsCheckboxes: ICheckbox = {...Array(filters.categories.length).fill(false)}
const [categoriesChecked, setCategoriesChecked] = useState(categoriesCheckboxes);
const [brandsChecked, setBrandsChecked] = useState(brandsCheckboxes);


const handleClick = (type: keyof ICheckboxFilters, el:string, index: number) => {
  onCheck(type, el);
  if (type === 'categories') setCategoriesChecked(prev => ({...prev, [index]: !categoriesChecked[index]}))
  if (type === 'brands') setBrandsChecked(prev => ({...prev, [index]: !brandsChecked[index]}))
}

useEffect(() => {
  const maxMinPrice = [Math.min(...itemsToRender.map(el=> el.price)), Math.max(...itemsToRender.map(el=> el.price))]
  const maxMinStock = [Math.min(...itemsToRender.map(el=> el.stock)), Math.max(...itemsToRender.map(el=> el.stock))]
  if ((maxMinPrice[0] !== Infinity) && (maxMinStock[0] !== Infinity)) {
    setPrice(maxMinPrice);
    setStock(maxMinStock);
    setNotFound(false);
  } else {
    setPrice(filters.prices);
    setStock(filters.stock);
    setNotFound(true);
  }
}, [itemsToRender])

const [notFound, setNotFound] = useState(false)
const [price, setPrice] = useState<number[]>(filters.prices);
const [stock, setStock] = useState<number[]>(filters.stock);

const handleReset = () => {
  onReset();
  setCategoriesChecked(categoriesCheckboxes);
  setBrandsChecked(brandsCheckboxes);
  setPrice(filters.prices)
  setStock(filters.stock)
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
            <span>({calcAmount(itemsToRender, 'category', el)})</span>/
            <span>({calcAmount(items, 'category', el)})</span>
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
            <span>({calcAmount(itemsToRender, 'brand', el)})</span>/
            <span>({calcAmount(items, 'brand', el)})</span>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Price</h3>
        {(notFound) && <div  className="text-2xl">not found</div>}
        <div className='slider'>
          <div className={styles.sliderContainer}>
            <ReactSlider
              className={styles.slider}
              trackClassName={styles.sliderTrack}
              thumbClassName={styles.sliderThumb}
              thumbActiveClassName={styles.sliderThumbActive}
              min={filters.prices[0]}
              max={filters.prices[1]}
              value={price}
              minDistance={0}
              onChange={(value:number[]) => {
                onSliderChange('prices', value)
                setPrice(value);
              }}

            />
            {(!notFound) && <div className={styles.sliderText}>
              <span className={styles.sliderMin}>{`$${price[0]}`}</span>
              <span className={styles.sliderMax}>{`$${price[1]}`}</span>
            </div>}
          </div>
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Stock</h3>
        {(notFound) && <div className="text-2xl">not found</div>}
        <div className='slider'>
          <div className={styles.sliderContainer}>
            <ReactSlider
              className={styles.slider}
              trackClassName={styles.sliderTrack}
              thumbClassName={styles.sliderThumb}
              thumbActiveClassName={styles.sliderThumbActive}
              min={filters.stock[0]}
              max={filters.stock[1]}
              value={stock}
              minDistance={0}
              onChange={(value:number[]) => {
                onSliderChange('stock', value)
                setStock(value);
              }}
            />
            {(!notFound) && <div className={styles.sliderText}>
              <span className={styles.sliderMin}>{`${stock[0]}`}</span>
              <span className={styles.sliderMax}>{`${stock[1]}`}</span>
            </div>}
          </div>
      </div>
      </div>
    </div>
  )
}
