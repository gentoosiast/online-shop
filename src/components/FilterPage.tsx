import React, { useEffect, useState } from "react";
import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import { fetchData } from '../fetchData';
import { IItem, IItemsDto } from '../types/IItem';
import { ItemCardSize } from '../types/ItemCardSize';
import { ItemCard } from "./ItemCard";

export const FilterPage = ({url}: { url: string }) => {
  const [items, setItems] = useState<IItem[]>([]);
  const [fetchError, setFetchError] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [cardSize, setCardSize] = useState<ItemCardSize>("Small");

  const fetchItems = (url: string) => {
    fetchData<IItemsDto>(url)
    .then((data) => {
      setItems(data.products);
      setTotalItems(data.products.length);
    })
    .catch((error: string) => {
      setFetchError(error);
    });
  }

  useEffect(() => {
    fetchItems(url);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center items-center gap-10">
        <div>
          <select>
            <option value="priceUp">Sort by price (ascending)</option>
            <option value="priceDown">Sort by price (descending)</option>
            <option value="ratingUp">Sort by rating (ascending)</option>
            <option value="ratingDown">Sort by rating (descending)</option>
            <option value="discountUp">Sort by discount (ascending)</option>
            <option value="discountDown">Sort by discount (descending)</option>
          </select>
        </div>
        { Boolean(totalItems) &&
          <div>Found: {totalItems} items</div>
        }
        <input className="form-input" type='text' placeholder="I'm looking for..."></input>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setCardSize("Small");
            }
          }>
            <svg className={`feather list-icon border-2 ${cardSize === "Small" ? 'border-slate-700': 'border-transparent'}`}>
              <use href={`${featherSprite}#list`} />
            </svg>
          </button>
          <button
            onClick={() => {
              setCardSize("Large");
            }
          }>
            <svg className={`feather grid-icon border-2 ${cardSize === "Large" ? 'border-slate-700' : 'border-transparent'}`}>
              <use href={`${featherSprite}#grid`} />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-5">
        {items.map(item => <ItemCard key={item.id} item={item} size={cardSize} />)}
        {Boolean(fetchError) && <div className="p-20 text-center font-bold text-2xl">{fetchError}</div>}
      </div>
    </div>
    )
}
