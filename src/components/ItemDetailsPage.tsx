import { IItem } from "../types/IItem";
import React, {useState} from 'react';
import { ItemCard } from "./ItemCard"




interface IItemProps {
  item: IItem
}

export function ItemDetails ({item}: IItemProps) {
  const [addToCard, setAddToCard] = useState(false)
  const [enlargeImg, setEnlargeImg] = useState(item.images[0])
  const btnBgClassName = addToCard ? 'bg-red-100' : 'bg-blue-100';
  const btnClasses = ['py-2 px-4 border', btnBgClassName]

  const images = item.images.map((elem, i) => <
    img key={item.id+i} src = {elem} className="w-24 rounded cursor-pointer" alt={item.title}
    onClick = {() => setEnlargeImg(elem)}
    ></img>)

  return (
    <div className="border p-5 rounded flex flex-col items-center m-auto">
      <div className="p-5 flex justify-evenly w-full items-center">
        <span>store</span>
        <span>{'>>'}</span>
        <span>{item.category}</span>
        <span>{'>>'}</span>
        <span>{item.brand}</span>
        <span>{'>>'}</span>
        <span>{item.title}</span>
      </div>
      <div className="border p-5 rounded flex flex-col items-center m-auto">
        <div className="font-bold text-xl">{item.title}</div>
        <div className="flex flex-row gap-5">
          <div className="photos flex gap-2 items-center">
            <div className="all-pics flex flex-col gap-1">
              { images }
            </div>
            <div className="main-pic">
              <img src = {enlargeImg} className="w-72 rounded" alt={item.title}/>
            </div>
          </div>
          <div className="details">
            <div>
              <p className="font-bold">Description:</p>
              <p>{item.description}</p>
            </div>
            <div>
              <p className="font-bold">Discount:</p>
              <p>{item.discountPercentage}%</p>
            </div>
            <div>
              <p className="font-bold">Rating:</p>
              <p>{item.rating}</p>
            </div>
            <div>
              <p className="font-bold">Stock:</p>
              <p>{item.stock}</p>
            </div>
            <div>
              <p className="font-bold">Brand:</p>
              <p>{item.brand}</p>
            </div>
            <div>
              <p className="font-bold">Category:</p>
              <p>{item.category}</p>
            </div>
          </div>
          <div className="addtocard flex flex-col justify-center gap-5">
            <p className="font-bold text-xl">${item.price}</p>
            <button
              className={btnClasses.join(' ')}
              onClick={() => setAddToCard(prev => !prev)}
              >
                {addToCard ? 'remove from card' : 'add to card'}
            </button>
            <button
              className='py-2 px-4 border bg-blue-100'
              >
                Buy now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
