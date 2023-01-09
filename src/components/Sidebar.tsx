import React, { useEffect, useState } from 'react';
import Slider from 'rc-slider';
import { Checkbox } from "@material-tailwind/react";
import { useDebouncedCallback } from 'use-debounce';
import { IFilters, ICheckboxFilters, ISliderFilters, SliderValue, isSliderValue } from '../types/filters';
import { InitialItemsStats, FilteredItemsStats } from '../types/items';
import '../css/main.css';
import '../css/rc-slider.css';
import styles from '../css/sidebar.module.css';
import saleImg from '../assets/sale.webp';
import superSaleImg from '../assets/super_sale.png';

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
    <div className='w-80 text-base'>
      <div className='w-80 flex flex-col items-center gap-3'>
        <button className={styles.buttonReset} onClick={handleReset}>Сбросить фильтры</button>
        <button className={isCopied ? styles.buttonCopied : styles.buttonCopy}
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
          {initialItemsStats.categories.map((category, i) =>
            <div key={i} className={`${filteredItemsStats.categoryCounts.get(category) ? styles.item : styles.itemOpacity}`} >
              <Checkbox color="green" label={category}
                onChange={() => handleClick('categories', category)}
                checked={isChecked('categories', category)}
              />
              <div>
                <span>({filteredItemsStats.categoryCounts.get(category) ?? 0}</span>/
                <span>{initialItemsStats.categoryCounts.get(category) ?? 0})</span>
             </div>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Бренд</h3>
        <fieldset  className={styles.items_brand}>
          {initialItemsStats.brands.map((brand, i) =>
            <div key={i} className={`${filteredItemsStats.brandCounts.get(brand) ? styles.item : styles.itemOpacity}`}>
              <Checkbox color="green" label={brand}
                  onChange={() => handleClick('brands', brand)}
                  checked={isChecked('brands', brand)}
                />
              <div>
                <span>({filteredItemsStats.brandCounts.get(brand) ?? 0}</span>/
                <span>{initialItemsStats.brandCounts.get(brand) ?? 0})</span>
              </div>
            </div>
          )}
        </fieldset>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>Цена, ₽</h3>
        {filteredItemsStats.total === 0 && <div  className={styles.not_found}>не найдено</div>}
        <div className='slider'>
          <div className={styles.sliderContainer}>
            <Slider
              range
              min={initialItemsStats.price[0]}
              max={initialItemsStats.price[1]}
              value={price}
              marks={initialItemsStats.priceValues}
              dots={true}
              allowCross={false}
              step={null}
              onChange={(value) => {
                handleSliderChange('price', value);
              }}
            />
            {filteredItemsStats.total > 0 && <div className={styles.sliderText}>
              <span className={styles.sliderMin}>{`${price[0]}`}</span>
              <span className={styles.sliderMax}>{`${price[1]}`}</span>
            </div>}
          </div>
        </div>
      </div>
      <div className={styles.box}>
        <h3 className={styles.h3}>На складе, шт.</h3>
        {filteredItemsStats.total === 0 && <div className={styles.not_found}>не найдено</div>}
        <div className='slider'>
          <div className={styles.sliderContainer}>
            <Slider
              range
              min={initialItemsStats.stock[0]}
              max={initialItemsStats.stock[1]}
              value={stock}
              marks={initialItemsStats.stockValues}
              dots={true}
              allowCross={false}
              step={null}
              onChange={(value) => {
                handleSliderChange('stock', value);
              }}
            />
            {filteredItemsStats.total > 0 && <div className={styles.sliderText}>
              <span className={styles.sliderMin}>{`${stock[0]}`}</span>
              <span className={styles.sliderMax}>{`${stock[1]}`}</span>
            </div>}
          </div>
      </div>
      </div>
      <div className={styles.box}>
        <img src={superSaleImg} alt="" className='relative top-28 left-4'/>
        <p className={styles.sale}>скидки до 30%</p>
        <img src={saleImg} alt="Фото милого котика" className='rounded-md'/>
      </div>
    </div>
  )
}
