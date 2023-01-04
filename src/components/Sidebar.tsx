import React, { useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { useDebouncedCallback } from 'use-debounce';
import { IFilters, ICheckboxFilters, ISliderFilters } from '../types/filters';
import { IItem } from '../types/IItem';
import '../css/main.css';
import styles from '../css/sidebar.module.css';

interface ISidebarProps {
  items: IItem[]
  onCheck: (type: keyof ICheckboxFilters, el: string) => void;
  filters: IFilters
  itemsToRender: IItem[]
  onReset: () => void
  onSliderChange: (type: keyof ISliderFilters, value: number[]) => void
  priceLimits: number[]
  stockLimits: number[]
  customFilters: IFilters
}

export const Sidebar = ({items, onCheck, filters, itemsToRender, onReset, onSliderChange, priceLimits, stockLimits, customFilters}: ISidebarProps) => {
  const calcAmount = (items: IItem[], itemProp: keyof IItem, value: string) => {
    return items.filter((item) => item[itemProp] === value).length;
  }

  const isChecked = (filterType: keyof ICheckboxFilters, value: string) => {
    return customFilters[filterType].includes(value);
  }

  const handleClick = (filterType: keyof ICheckboxFilters, value: string) => {
    onCheck(filterType, value);
  }

  const debounceSlider = useDebouncedCallback(
    (sliderType: keyof ISliderFilters, sliderValue: number[]) => {
      onSliderChange(sliderType, sliderValue);
    }, 800
  );

  useEffect(() => {
    if (itemsToRender.length > 0) {
      const maxMinPrice = [Math.min(...itemsToRender.map((item) => item.price)), Math.max(...itemsToRender.map((item) => item.price))]
      const maxMinStock = [Math.min(...itemsToRender.map((item) => item.stock)), Math.max(...itemsToRender.map((item) => item.stock))]
      setPrice(priceLimits.length > 0 ? priceLimits : maxMinPrice);
      setStock(stockLimits.length > 0 ? stockLimits : maxMinStock);
    } else {
      setPrice(filters.price);
      setStock(filters.stock);
    }
  }, [filters.price, filters.stock, itemsToRender, priceLimits, stockLimits]);

  const [price, setPrice] = useState<number[]>(filters.price);
  const [stock, setStock] = useState<number[]>(filters.stock);

  const handleReset = () => {
    onReset();
    setPrice(filters.price)
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
          {(isCopied) ? 'Link copied!' : 'Copy link'}
          </button>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Category</h3>
        <fieldset className={styles.items}>
          {filters.categories.map((category, i) =>
          <div key={i} className={`${(calcAmount(itemsToRender, 'category', category)) ? styles.item : styles.itemOpacity}`} >
            <label htmlFor={'1'+i.toString()} className={styles.label}>
            <input type='checkbox' id={'1'+i.toString()} className={styles.checkbox}
              onChange={() => handleClick('categories', category)}
              checked={isChecked('categories', category)}
            />
            {category}</label>
            <span>({calcAmount(itemsToRender, 'category', category)})</span>/
            <span>({calcAmount(items, 'category', category)})</span>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Brand</h3>
        <fieldset  className={styles.items}>
          {filters.brands.map((brand, i) =>
            <div key={i} className={`${(calcAmount(itemsToRender, 'brand', brand)) ? styles.item : styles.itemOpacity}`}>
            <label htmlFor={'2'+i.toString()} className={styles.label}>
            <input type='checkbox' id={'2'+i.toString()} className={styles.checkbox}
              onChange={() => handleClick('brands', brand)}
              checked = {isChecked('brands', brand)}
            />
            {brand}</label>
            <span>({calcAmount(itemsToRender, 'brand', brand)})</span>/
            <span>({calcAmount(items, 'brand', brand)})</span>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Price</h3>
        {itemsToRender.length === 0 && <div  className="text-2xl">not found</div>}
        <div className='slider'>
          <div className={styles.sliderContainer}>
            <ReactSlider
              className={styles.slider}
              trackClassName="sliderTrack"
              thumbClassName={styles.sliderThumb}
              thumbActiveClassName={styles.sliderThumbActive}
              min={filters.price[0]}
              max={filters.price[1]}
              value={price}
              minDistance={0}
              onChange={(value: number[]) => {
                setPrice(value);
                debounceSlider('price', value);
              }}

            />
            {itemsToRender.length > 0 && <div className={styles.sliderText}>
              <span className={styles.sliderMin}>{`$${price[0]}`}</span>
              <span className={styles.sliderMax}>{`$${price[1]}`}</span>
            </div>}
          </div>
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Stock</h3>
        {itemsToRender.length === 0 && <div className="text-2xl">not found</div>}
        <div className='slider'>
          <div className={styles.sliderContainer}>
            <ReactSlider
              className={styles.slider}
              trackClassName="sliderTrack"
              thumbClassName={styles.sliderThumb}
              thumbActiveClassName={styles.sliderThumbActive}
              min={filters.stock[0]}
              max={filters.stock[1]}
              value={stock}
              minDistance={0}
              onChange={(value: number[]) => {
                setStock(value);
                debounceSlider('stock', value);
              }}
            />
            {itemsToRender.length > 0 && <div className={styles.sliderText}>
              <span className={styles.sliderMin}>{`${stock[0]}`}</span>
              <span className={styles.sliderMax}>{`${stock[1]}`}</span>
            </div>}
          </div>
      </div>
      </div>
    </div>
  )
}
