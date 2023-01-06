import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';``
import 'rc-slider/assets/index.css';
import { useDebouncedCallback } from 'use-debounce';
import { SliderValue, isSliderValue } from '../types/SliderValue';
import { IFilters, ICheckboxFilters, ISliderFilters } from '../types/filters';
import { InitialItemsStats, FilteredItemsStats } from '../types/items';
import '../css/main.css';
import styles from '../css/sidebar.module.css';

interface ISidebarProps {
  initialItemsStats: InitialItemsStats;
  filteredItemsStats: FilteredItemsStats;
  filters: IFilters;
  onFilterChange: (type: keyof IFilters, value: string | SliderValue) => void;
  onReset: () => void;
}

export const Sidebar = ({initialItemsStats, filteredItemsStats, filters, onFilterChange, onReset }: ISidebarProps) => {
  const [price, setPrice] = useState<SliderValue>(filteredItemsStats.price);
  const [stock, setStock] = useState<SliderValue>(filteredItemsStats.stock);

  useEffect(() => {
    setPrice(filteredItemsStats.price);
  }, [filteredItemsStats.price]);

  useEffect(() => {
    setStock(filteredItemsStats.stock);
  }, [filteredItemsStats.stock]);

  const isChecked = (filterType: keyof Pick<InitialItemsStats, "brands" | "categories">, value: string) => {
    return filters[filterType].includes(value);
  }

  const handleClick = (filterType: keyof ICheckboxFilters, value: string) => {
    onFilterChange(filterType, value);
  }

  const debounceSlider = useDebouncedCallback(
    (sliderType: keyof ISliderFilters, sliderValue: SliderValue) => {
      onFilterChange(sliderType, sliderValue);
    }, 800
  );

  const handleSliderChange = (filterType: keyof ISliderFilters, value: number | number[]) => {
    if (isSliderValue(value)) {
      if (filterType === 'price') {
        setPrice(value);
      } else {
        setStock(value);
      }
      debounceSlider(filterType, value);
    }
  }

  const handleReset = () => {
    onReset();
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
          {initialItemsStats.categories.map((category, i) =>
          <div key={i} className={`${filteredItemsStats.categoryCounts.get(category) ? styles.item : styles.itemOpacity}`} >
            <label htmlFor={'1'+i.toString()} className={styles.label}>
            <input type='checkbox' id={'1'+i.toString()} className={styles.checkbox}
              onChange={() => handleClick('categories', category)}
              checked={isChecked('categories', category)}
            />
            {category}</label>
            <span>({filteredItemsStats.categoryCounts.get(category) ?? 0})</span>/
            <span>({initialItemsStats.categoryCounts.get(category) ?? 0})</span>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Brand</h3>
        <fieldset  className={styles.items}>
          {initialItemsStats.brands.map((brand, i) =>
            <div key={i} className={`${filteredItemsStats.brandCounts.get(brand) ? styles.item : styles.itemOpacity}`}>
            <label htmlFor={'2'+i.toString()} className={styles.label}>
            <input type='checkbox' id={'2'+i.toString()} className={styles.checkbox}
              onChange={() => handleClick('brands', brand)}
              checked = {isChecked('brands', brand)}
            />
            {brand}</label>
            <span>({filteredItemsStats.brandCounts.get(brand) ?? 0})</span>/
            <span>({initialItemsStats.brandCounts.get(brand) ?? 0})</span>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Price</h3>
        {filteredItemsStats.total === 0 && <div  className="text-2xl">not found</div>}
        <div className='slider'>
          <div className={styles.sliderContainer}>
            <Slider
              range
              min={initialItemsStats.price[0]}
              max={initialItemsStats.price[1]}
              value={price}
              marks={initialItemsStats.priceValues}
              dots={true}
              included={false}
              allowCross={false}
              step={null}
              onChange={(value: number[] | number) => {
                handleSliderChange('price', value);
              }}
            />

            {/* <ReactSlider
              className={styles.slider}
              trackClassName="sliderTrack"
              thumbClassName={styles.sliderThumb}
              thumbActiveClassName={styles.sliderThumbActive}
              min={initialItemsStats.price[0]}
              max={initialItemsStats.price[1]}
              value={price}
              minDistance={0}
              onChange={(value: SliderValue) => {
                setPrice(value);
                debounceSlider('price', value);
              }}

            /> */}
            {filteredItemsStats.total > 0 && <div className={styles.sliderText}>
              <span className={styles.sliderMin}>{`$${price[0]}`}</span>
              <span className={styles.sliderMax}>{`$${price[1]}`}</span>
            </div>}
          </div>
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Stock</h3>
        {filteredItemsStats.total === 0 && <div className="text-2xl">not found</div>}
        <div className='slider'>
          <div className={styles.sliderContainer}>
            <Slider
              range
              min={initialItemsStats.stock[0]}
              max={initialItemsStats.stock[1]}
              value={stock}
              marks={initialItemsStats.stockValues}
              dots={true}
              included={false}
              allowCross={false}
              step={null}
              onChange={(value: number[] | number) => {
                handleSliderChange('stock', value);
              }}
            />
            {/* <ReactSlider
              className={styles.slider}
              trackClassName="sliderTrack"
              thumbClassName={styles.sliderThumb}
              thumbActiveClassName={styles.sliderThumbActive}
              min={initialItemsStats.stock[0]}
              max={initialItemsStats.stock[1]}
              value={stock}
              minDistance={0}
              onChange={(value: SliderValue) => {
                setStock(value);
                debounceSlider('stock', value);
              }}

            /> */}
            {filteredItemsStats.total > 0 && <div className={styles.sliderText}>
              <span className={styles.sliderMin}>{`${stock[0]}`}</span>
              <span className={styles.sliderMax}>{`${stock[1]}`}</span>
            </div>}
          </div>
      </div>
      </div>
    </div>
  )
}
