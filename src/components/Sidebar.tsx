import React, { useEffect, useState } from 'react';
import ReactSlider from 'react-slider';
import { IFilters, ICheckboxFilters, ISliderFilters } from '../types/filters';
import { IItem } from '../types/IItem';
import '../css/main.css';
import styles from '../css/sidebar.module.css';
import { Checkbox } from "@material-tailwind/react";

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
    <div className='w-80 text-base'>
      <div className='w-80 flex flex-col gap-3'>
        <button className={styles.buttonReset} onClick={handleReset}>Сбросить фильтры</button>
        <button className={ (isCopied) ? styles.buttonCopied : styles.buttonCopy}
        onClick={()=>{navigator.clipboard.writeText(location.href).then(() => {
          handleCopy();
          }, () => console.log('failed to copy'));
        }}>
          {(isCopied) ? 'Скопирована!' : 'Скопировать ссылку'}
          </button>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Категория</h3>
        <fieldset className={styles.items_category}>
          {filters.categories.map((category, i) =>
            <div key={i} className={`${(calcAmount(itemsToRender, 'category', category)) ? styles.item : styles.itemOpacity}`} >
            {/* <label htmlFor={'1'+i.toString()} className={styles.label}>
              <input type='checkbox' id={'1'+i.toString()} className={styles.checkbox}
                onChange={() => handleClick('categories', category)}
                checked={isChecked('categories', category)}
              /> */}
            {/* {category}</label> */}
              <Checkbox color="green" label={category} id={'1'+i.toString()}
                onChange={() => handleClick('categories', category)}
                checked={isChecked('categories', category)}
              />
              <div>
                <span>({calcAmount(itemsToRender, 'category', category)})</span>/
                <span>({calcAmount(items, 'category', category)})</span>
             </div>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Бренд</h3>
        <fieldset  className={styles.items_brand}>
          {filters.brands.map((brand, i) =>
            <div key={i} className={`${(calcAmount(itemsToRender, 'brand', brand)) ? styles.item : styles.itemOpacity}`}>
            {/* <label htmlFor={'2'+i.toString()} className={styles.label}>
            <input type='checkbox' id={'2'+i.toString()} className={styles.checkbox}
              onChange={() => handleClick('brands', brand)}
              checked = {isChecked('brands', brand)}
            />
            {brand}</label> */}
              <Checkbox color="green" label={brand} id={'2'+i.toString()}
                  onChange={() => handleClick('brands', brand)}
                  checked={isChecked('brands', brand)}
                />
              <div>
                <span>({calcAmount(itemsToRender, 'brand', brand)})</span>/
                <span>({calcAmount(items, 'brand', brand)})</span>
              </div>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Цена, ₽</h3>
        {itemsToRender.length === 0 && <div  className={styles.not_found}>не найдено</div>}
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
                onSliderChange('price', value)
                setPrice(value);
              }}

            />
            {itemsToRender.length > 0 && <div className={styles.sliderText}>
              <span className={styles.sliderMin}>{`${price[0]}₽`}</span>
              <span className={styles.sliderMax}>{`${price[1]}₽`}</span>
            </div>}
          </div>
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>На складе, шт.</h3>
        {itemsToRender.length === 0 && <div className={styles.not_found}>не найдено</div>}
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
                onSliderChange('stock', value)
                setStock(value);
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
