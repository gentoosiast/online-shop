import React, { useState } from "react";
import { Form, useSearchParams, useLoaderData } from "react-router-dom";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { fetchData } from '../fetchData';
import { IItemsDto } from '../types/IItem';
import { ItemCardSize } from '../types/ItemCardSize';
import { ItemCard } from "./ItemCard";
import { SortOption } from "../types/SortOption";
import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import { Sidebar } from "./Sidebar"

export interface IFilters {
  categories: string []
  brands: string []
  prices: number []
  stock: number []
}

export interface IFilterApplied {
  categories: boolean
  brands: boolean
  prices: boolean
  stock: boolean
}

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
  // const [tmp, setTmp] = useState(0)
  // setTmp(items.length)
  // const [initialParams, setInitialParams] = useState<IFilters>({categories: [''], brands: [''], prices: [0], stock: [0]})
  // const [filteredParams, setFilteredParams] = useState<IFilters>({categories: [''], brands: [''], prices: [0], stock: [0]})
  // const [isFiltered, setIsFiltered] = useState<IFilterApplied>({categories: false, brands: false, prices:false, stock: false});

  // setInitialParams({
  //   categories: [...new Set(items.map(el=> el.category))],
  //   brands: [...new Set(items.map(el=> el.brand))],
  //   prices: [...items.map(el=> el.price)],
  //   stock: [...items.map(el=> el.stock)],
  // })
  // setFilteredParams({
  //   categories: [...new Set(items.map(el=> el.category))],
  //   brands: [...new Set(items.map(el=> el.brand))],
  //   prices: [...items.map(el=> el.price)],
  //   stock: [...items.map(el=> el.stock)],
  // })


  // const onFilterClick = (filterType: string, filterBox: string) => {
  //   if (filterType === 'categories') {
  //     // if (isFilteredByCategory) {
  //     if (isFiltered.categories) {
  //       // if (filteredCategories.includes(filterBox)) {
  //       if (filteredParams.categories.includes(filterBox)) {
  //         // if (filteredCategories.length === 1) {
  //         if (filteredParams.categories.length === 1) {
  //           // setIsFilteredByCategory(false);
  //           setIsFiltered(prev => ({...prev, categories: false}))
  //           // setFilteredCategories(initialParams.categories);
  //           setFilteredParams(prev => ({ ...prev, categories: initialParams.categories}))
  //         }
  //         else {
  //           // setFilteredCategories(prev => [...prev].filter(el => el !== filterBox))
  //           setFilteredParams(prev => ({ ...prev, categories: [...prev.categories.filter(el => el !== filterBox)]}))
  //         }
  //       }
  //       else {
  //         // setFilteredCategories(prev => [...prev, filterBox])
  //         setFilteredParams(prev => ({ ...prev, categories: [...prev.categories, filterBox]}))
  //       }
  //     } else {
  //       // setIsFilteredByCategory(true);
  //       setIsFiltered(prev => ({...prev, categories: true}))
  //       // setFilteredCategories([filterBox])
  //       setFilteredParams(prev => ({ ...prev, categories: [filterBox]}))
  //     }
  //   }

  //   // if (filterType === 'brands') {
  //   //   if (isFilteredByBrand) {
  //   //     if (filteredBrands.includes(filterBox)) {
  //   //       if (filteredBrands.length === 1) {
  //   //         setIsFilteredByBrand(false);
  //   //         setFilteredBrands(initialParams.brands)
  //   //       }
  //   //       else setFilteredBrands(prev => [...prev].filter(el => el !== filterBox))
  //   //     }
  //   //     else setFilteredBrands(prev => [...prev, filterBox])
  //   //   } else {
  //   //     setIsFilteredByBrand(true);
  //   //     setFilteredBrands([filterBox])
  //   //   }
  //   // }
  // }

  // const itemsToRender = [...items].filter(elem => (filteredCategories.some(el => el === elem.category)))
  // const itemsToRender = [...items].filter(elem => (filteredParams.categories.some(el => el === elem.category)))
  // .filter(elem => filteredBrands.some(el => el === elem.brand))

  return (
    <div>
      {/* <Sidebar items={items} onCheck={(type, el)=>onFilterClick(type, el)} filters={initialParams}/> */}
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
    </div>
    )
}
