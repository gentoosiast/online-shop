import React, { useEffect, useState } from "react"
import { IItem, IItemsDto } from '../types/IItem'; // TODO: temporary hack
import { ItemCard } from "./ItemCard";

interface IAllCardsProps {
  url: string
  isSizeSmall: boolean
}

export function AllCards({url, isSizeSmall}: IAllCardsProps) {
  const [items, setItems] = useState<IItem[]>([])
  const fetchItems = () => {
    fetch(url)
    .then(res =>res.json())
    .then((json: IItemsDto) => {
      setItems(json.products)
    })
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="flex row-auto flex-wrap gap-5">
      {items.map(item => <ItemCard item={item} isSizeSmall = {isSizeSmall} key={item.id}/>)}
    </div>
  );
}
