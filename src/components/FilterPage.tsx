import React, { useEffect, useState } from "react";
import { Form, useSearchParams, useLoaderData } from "react-router-dom";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { fetchData } from '../fetchData';
import { IItemsDto } from '../types/IItem';
import { ItemCardSize } from '../types/ItemCardSize';
import { ItemCard } from "./ItemCard";
import { SortOption } from "../types/SortOption";
import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import { Sidebar, ICheckboxFilters, ISliderFilters } from "./Sidebar"

export interface IFilters {
  categories: string[];
  brands: string[];
  prices: number[];
  stock: number[];
}

export interface IFilterApplied {
  categories: boolean;
  brands: boolean;
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

  const initialFilters = {
    categories: [...new Set(items.map(el => el.category))],
    brands: [...new Set(items.map(el => el.brand))],
    prices: [Math.min(...items.map(el => el.price)), Math.max(...items.map(el => el.price))],
    stock: [Math.min(...items.map(el => el.stock)), Math.max(...items.map(el => el.stock))],
  }

  const categorySearchParam = searchParams.get('categories');
  const brandSearchParam = searchParams.get('brands');
  const priceSearchParam = searchParams.get('prices');
  const stockSearchParam = searchParams.get('stock');

  const initialCalcFilters = {
    categories: categorySearchParam ? categorySearchParam.split('↕') : [],
    brands: brandSearchParam ? brandSearchParam.split('↕') : [],
    prices: priceSearchParam ? priceSearchParam.split('↕').map(el => parseInt(el, 10)) : [],
    stock: stockSearchParam ? stockSearchParam.split('↕').map(el => parseInt(el, 10)) : [],
  }

  const priceMoved = Boolean(priceSearchParam);
  const stockMoved = Boolean(stockSearchParam);
  const considerSliders = (initialCalcFilters.categories.length + initialCalcFilters.brands.length == 0);
  const [calcFilters, setCalcFilters] = useState<IFilters>(initialCalcFilters);
  const [customSliders, setCustomSliders] = useState({prices: initialCalcFilters.prices, stock: initialCalcFilters.stock})
  const [isUserFiltered, setIsUserFiltered] = useState({prices: priceMoved && considerSliders, stock: stockMoved && considerSliders});

  const onFilterClick = (filterType: keyof ICheckboxFilters | keyof ISliderFilters, filterBox?: string, sliderValue?: number[]) => {
    if ( ((filterType === 'categories') || (filterType === 'brands')) && (filterBox !== undefined)) {
      if (calcFilters[filterType].includes(filterBox)) {
        if (calcFilters.categories.length + calcFilters.brands.length == 1) {
          setIsUserFiltered({prices: Boolean(customSliders.prices.length), stock: Boolean(customSliders.stock.length)})
          setCalcFilters(prev => ({ ...prev, [filterType]: [], prices: customSliders.prices, stock: customSliders.stock}))
        }
        else {
          setCalcFilters(prev => ({ ...prev, [filterType]: [...prev[filterType].filter(el => el !== filterBox)]}))
        }
      }
      else {
        setCalcFilters(prev => ({ ...prev, [filterType]: [...prev[filterType], filterBox]}))
        setIsUserFiltered({prices: false, stock: false})
      }
    }
    if (((filterType === 'prices') || (filterType === 'stock')) && (sliderValue !== undefined)) {
      setCalcFilters(prev => ({ ...prev, [filterType]: sliderValue}));
      setCustomSliders(prev => ({ ...prev, [filterType]: sliderValue}));
      setIsUserFiltered(prev => ({ ...prev, [filterType]: true}))
    }
  }

  useEffect(() => {
    Object.entries(calcFilters).forEach(([filterType, value]) => {
      if (!(Array.isArray(value))) {
        return;
      }
      // console.log('filterType', filterType, 'value', value);
      if (value.length > 0) {
        searchParams.set(`${filterType}`, `${value.join('↕')}`);
      } else {
        searchParams.delete(filterType);
      }
      setSearchParams(searchParams);
    })
  }, [calcFilters, searchParams, setSearchParams]);

  const onReset = () => {
    setCalcFilters({
      categories: [],
      brands: [],
      prices: [],
      stock: [],
    });
    setIsUserFiltered({prices: false, stock: false})
  }

  const itemsToRender = items
    .filter(elem => (calcFilters.categories.length>0) ? (calcFilters.categories.some(el => el === elem.category)): elem)
    .filter(elem => (calcFilters.brands.length>0) ? (calcFilters.brands.some(el => el === elem.brand)) : elem)
    .filter(elem => (calcFilters.prices.length>0) ? (elem.price >= calcFilters.prices[0] && elem.price <= calcFilters.prices[1]) : elem)
    .filter(elem => (calcFilters.stock.length>0) ? (elem.stock >= calcFilters.stock[0] && elem.stock <= calcFilters.stock[1]) : elem)


  if (isLoading || isFetching) {
    return (
      <div className="preloader">Loading</div>
    );
  }

  return (
    <div className='flex'>
      <Sidebar items={items} onCheck={(type, el) => onFilterClick(type, el)}
      filters={initialFilters} itemsToRender={itemsToRender}
      onReset={() => onReset()} onSliderChange={(type, value) => onFilterClick(type, '', value)}
      pricesLimits = {(isUserFiltered.prices) ? calcFilters.prices: []}
      stockLimits = {(isUserFiltered.stock) ? calcFilters.stock: []}
      customFilters={calcFilters}
      />
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
          {Boolean(itemsToRender.length) && itemsToRender.map(item => <ItemCard key={item.id} item={item} size={cardSize} />)}
          {Boolean(itemsToRender.length===0) && <div className="text-5xl">No products found</div>}
        </div>
      </div>
    </div>
    )
}
