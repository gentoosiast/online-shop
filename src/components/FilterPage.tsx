import React, { useState } from "react";
import { Form, useSearchParams, useLoaderData } from "react-router-dom";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { fetchData } from '../fetchData';
import { IItemsDto } from '../types/IItem';
import { ItemCardSize } from '../types/ItemCardSize';
import { ItemCard } from "./ItemCard";
import { SortOption } from "../types/SortOption";
import featherSprite from 'feather-icons/dist/feather-sprite.svg';

const isItemCardSize = (value: string): value is ItemCardSize => {
  return value === 'Small' || value === 'Large';
}

const isSortOption = (value: string): value is SortOption => {
  const options = ["price-ASC", "price-DESC", "rating-ASC", "rating-DESC", "discount-ASC", "discount-DESC"];

  return options.includes(value);
}

const fetchItems = async () => {
  const endpoint = 'https://dummyjson.com/products?limit=25';
  try {
    const data = await fetchData<IItemsDto>(endpoint);
    return data;
  } catch(e) {
    throw new Error(e instanceof Error ? e.message : "fetchItems: Some unknown error occured");
  }
}

const itemsQuery = () => ({
  queryKey: ['items'],
  queryFn: async () => fetchItems(),
  refetchOnWindowFocus: false
});

export const loader =
  (queryClient: QueryClient) =>
  async (): Promise<IItemsDto> => {
    const query = itemsQuery();
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
}

export const FilterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >
  const { data: {products: items}, isLoading, isFetching } = useQuery({
    ...itemsQuery(),
    initialData,
    staleTime: 1000 * 60 * 5,
  });

  const cardSearchParam = searchParams.get('card') ?? '';
  const initialCardSize = isItemCardSize(cardSearchParam) ? cardSearchParam : 'Small';
  const [cardSize, setCardSize] = useState<ItemCardSize>(initialCardSize);

  const sortSearchParam = searchParams.get('sort') ?? '';
  const initialSortOption = isSortOption(sortSearchParam) ? sortSearchParam : 'price-ASC';

  if (isLoading || isFetching) {
    return (
      <div className="preloader">Loading</div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-center items-center gap-10">
        <div>
          <select name="sort" defaultValue={initialSortOption} onChange={(event) => {
            searchParams.set('sort', event.target.value);
            setSearchParams(searchParams);
          }}>
            <option value="price-ASC">Sort by price (ascending)</option>
            <option value="price-DESC">Sort by price (descending)</option>
            <option value="rating-ASC">Sort by rating (ascending)</option>
            <option value="rating-DESC">Sort by rating (descending)</option>
            <option value="discount-ASC">Sort by discount (ascending)</option>
            <option value="discount-DESC">Sort by discount (descending)</option>
          </select>
        </div>
        <div>Found: {items.length} items</div>
        <Form id="search-form" role="search" autoComplete="off">
          <input id="q" className="form-input" name="q" type='search' placeholder="I'm looking for..."
            defaultValue={searchParams.get('q') ?? ''} aria-label="Search items"
            onChange={(event) => {
              event.preventDefault();
              searchParams.set('q', event.target.value);
              setSearchParams(searchParams);
            }} />
        </Form>
        <div className="flex gap-2">
          <button
            onClick={() => {
              searchParams.set('card', 'Small');
              setSearchParams(searchParams);
              setCardSize("Small");
            }
          }>
            <svg className={`feather list-icon border-2 ${cardSize === "Small" ? 'border-slate-700': 'border-transparent'}`}>
              <use href={`${featherSprite}#list`} />
            </svg>
          </button>
          <button
            onClick={() => {
              searchParams.set('card', 'Large');
              setSearchParams(searchParams);
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
      </div>
    </div>
    )
}
