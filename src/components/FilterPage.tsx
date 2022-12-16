import React, { useEffect, useState } from "react";
import { AllCards } from "../components/ItemsFetch";
import gridIcon from "../assets/grid.svg"
import listIcon from "../assets/list.svg"


export const FilterPage = () => {
  const [totalItems, setTotalItems] = useState(10);
  const [smallSizeGrid, setsmallSizeGrid] = useState(true)

  const baseGridClassName = 'h-8 cursor-pointer'
  const activeGridClassName = 'border border-2 border-red-500'
  const smallGridClassName = smallSizeGrid ? activeGridClassName : 'border-none';
  const bigGridClassName = smallSizeGrid ? 'border-none' : activeGridClassName;

  return (
    <div>
      <div className="flex justify-between">
        <div>
          <select>
            <option value = "priceUp">Sort by price (ascending)</option>
            <option value = "priceDown">Sort by price (descending)</option>
            <option value = "ratingUp">Sort by rating (ascending)</option>
            <option value = "ratingDown">Sort by rating (descending)</option>
            <option value = "discountUp">Sort by discount (ascending)</option>
            <option value = "discountDown">Sort by discount (descending)</option>
          </select>
        </div>
        <div>Found: {totalItems}</div>
        <input className="form-input" type='text' placeholder="I'm looking for..."></input>
        <div className="flex">
          <img src={listIcon} className={[baseGridClassName, smallGridClassName].join(' ')}
          onClick={() => {
            if (!smallSizeGrid) setsmallSizeGrid(prev => !prev)}
          }
          />
          <img src={gridIcon} className={[baseGridClassName, bigGridClassName].join(' ')}
          onClick={() => {
            if (smallSizeGrid) setsmallSizeGrid(prev => !prev)}
          }/>
        </div>
      </div>
      <AllCards url = {'https://dummyjson.com/products?limit=10'}/>
    </div>
  )
}
