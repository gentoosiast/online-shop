import React, { useEffect, useState } from "react"
import { IItem, IItemsDto } from '../types/IItem'; // TODO: temporary hack
import { ItemCard } from "./ItemCard";

interface IAllCardsProps {
  url: string
  isSizeSmall: boolean
}

export function AllCards({url, isSizeSmall}: IAllCardsProps) {
  const [items, setItems] = useState<IItem[]>([])
  const [err, setErr] = useState(false)
  const fetchItems = () => {
    fetch(url)
    .then((res: Response) =>res.json())
    .then((json: IItemsDto) => {
      setItems(json.products)
    })
    .catch(error => {
      setErr(true)
    })
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <div className="flex row-auto flex-wrap gap-5">
      {items.map(item => <ItemCard item={item} isSizeSmall = {isSizeSmall} key={item.id}/>)}
      {err && <div className="p-20 text-center font-bold text-2xl">Error! No access to the server. Please try again later</div>}
    </div>
  );
}
