import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { cartStore } from '../storage/cart.store';
import { IItem } from "../types/IItem";
import { fetchData } from '../fetchData';

interface IItemProps {
  id: number;
}

export const ItemDetails = observer(({ id }: IItemProps) => {
  const endpoint = `https://dummyjson.com/products/${id}`;
  const [item, setItem] = useState<IItem|null>(null);
  const [fetchError, setFetchError] = useState('');
  const fetchItem = (url: string) => {
    fetchData<IItem>(url)
    .then((data) => {
      setItem(data);
    })
    .catch((error: string) => {
      setFetchError(error);
    });
  }

  useEffect(() => {
    fetchItem(endpoint);
  }, []);

  const [mainImgIdx, setMainImgIdx] = useState(0);
  return (
    <div className="border p-5 rounded flex flex-col items-center m-auto">
      {Boolean(fetchError) && <div className="p-20 text-center font-bold text-2xl">{fetchError}</div>}
      {item &&
        <>
          <div className="p-5 flex justify-evenly items-center gap-1">
            <span>store</span>
            <span className="breadcrumb">/</span>
            <span>{item.category}</span>
            <span className="breadcrumb">/</span>
            <span>{item.brand}</span>
            <span className="breadcrumb">/</span>
            <span>{item.title}</span>
          </div>
          <div className="border p-5 rounded flex flex-col gap-5 items-center m-auto">
            <div className="font-bold text-6xl">{item.title}</div>
            <div className="flex flex-row gap-5">
              <div className="photos flex gap-2 items-center">
                <div className="all-pics flex flex-col gap-1">
                  {
                    // TODO: images from different URLs can be duplicates
                    item.images.map((img, i) =>
                      <img key={i} src={img} className={`w-24 rounded cursor-pointer border-2
                        ${img === item.images[mainImgIdx] ? "border-blue-600": "border-transparent"}`} alt={item.title}
                        onClick = {() => setMainImgIdx(i)}
                      ></img>)
                  }
                </div>
                <div className="main-pic">
                  <img src={item.images[mainImgIdx]} className="w-72 rounded" alt={item.title}/>
                </div>
              </div>
              <div className="details flex flex-col gap-2">
                <div>
                  <p className="font-bold text-lg">Description:</p>
                  <p>{item.description}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Discount:</p>
                  <p>{item.discountPercentage}%</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Rating:</p>
                  <p>{item.rating}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Stock:</p>
                  <p>{item.stock}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Brand:</p>
                  <p>{item.brand}</p>
                </div>
                <div>
                  <p className="font-bold text-lg">Category:</p>
                  <p>{item.category}</p>
                </div>
              </div>
              <div className="addtocart flex flex-col justify-center items-center gap-10">
                <p className="font-bold text-5xl">${item.price}</p>
                <div className="flex flex-col gap-2">
                  <button
                    className={`button ${cartStore.items.has(item) ? 'button-delete' : 'button-add'}`}
                    onClick={() => {
                      if (cartStore.items.has(item)) {
                        cartStore.removeItem(item);
                      } else {
                        cartStore.addItem(item);
                      }
                    }}>
                    {cartStore.items.has(item) ? 'remove from cart' : 'add to cart'}
                  </button>
                  <button
                    className='button button-buy'>
                      buy now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
  )
});
