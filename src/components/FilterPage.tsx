import React, { useEffect, useState } from "react";
import { Form, useSearchParams, useLoaderData } from "react-router-dom";
import { useQuery, QueryClient } from '@tanstack/react-query';
import { fetchData } from '../fetchData';
import { IItemsDto } from '../types/IItem';
import { ItemCardSize } from '../types/ItemCardSize';
import { ItemCard } from "./ItemCard";
import { SortOption } from "../types/SortOption";
import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import { Slider } from "./Slider";
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

  if (isLoading || isFetching) {
    return (
      <div className="preloader">Loading</div>
    );
  }

  const initialFilters = {
    categories: [...new Set(items.map(el => el.category))],
    brands: [...new Set(items.map(el => el.brand))],
    prices: [Math.min(...items.map(el => el.price)), Math.max(...items.map(el => el.price))],
    stock: [Math.min(...items.map(el => el.stock)), Math.max(...items.map(el => el.stock))],
  }

  const categorySearchParam = searchParams.get('categories');
  // const initialCategory = (categorySearchParam) ? categorySearchParam : initialFilters.categories.join('↕');
  // const initialCategory = (categorySearchParam) ? categorySearchParam : "";
  const isInitialCategoryFiltered = Boolean(categorySearchParam);
  const brandSearchParam = searchParams.get('brands');
  // const initialBrand = (brandSearchParam) ? brandSearchParam : initialFilters.brands.join('↕');
  const isInitialBrandFiltered = Boolean(brandSearchParam);
  const priceSearchParam = searchParams.get('prices');
  const initialPrice = (priceSearchParam) ? priceSearchParam : initialFilters.prices.join('↕');
  const stockSearchParam = searchParams.get('stock');
  const initialStock = (stockSearchParam) ? stockSearchParam : initialFilters.stock.join('↕');

  const initialCustomFilters = {
    // categories: initialCategory.split('↕'),
    categories: categorySearchParam ? categorySearchParam.split('↕') : [],
    // brands: initialBrand.split('↕'),
    brands: brandSearchParam ? brandSearchParam.split('↕') : [],
    prices: initialPrice.split('↕').map(el => parseInt(el, 10)),
    stock: initialStock.split('↕').map(el => parseInt(el, 10)),
  }

  const isInitialFiltered = {
    categories: isInitialCategoryFiltered,
    brands: isInitialBrandFiltered,
  }

  // const [customFilters, setCustomFilters] = useState<IFilters>(initialFilters)
  const [customFilters, setCustomFilters] = useState<IFilters>(initialCustomFilters)
  // const [isFiltered, setIsFiltered] = useState<IFilterApplied>({categories: false, brands: false});
  const [isFiltered, setIsFiltered] = useState<IFilterApplied>(isInitialFiltered);

  const onFilterClick = (filterType: keyof ICheckboxFilters | keyof ISliderFilters, filterBox?: string, sliderValue?: number[]) => {
    if ( ((filterType === 'categories') || (filterType === 'brands')) && (filterBox !== undefined)) {
      if (isFiltered[filterType]) {
        // если эта категория фильтровалась
        if (customFilters[filterType].includes(filterBox)) {
          // есть кликнутый фильтр уже checked
          if (customFilters[filterType].length === 1) {
            // если это единственный фильтр в массиве, то возвращаем все фильтры и флаг false
            setIsFiltered(prev => ({...prev, [filterType]: false}))
            // setCustomFilters(prev => ({ ...prev, [filterType]: initialFilters[filterType]}))
            setCustomFilters(prev => ({ ...prev, [filterType]: []}))
          }
          else {
            // если не единственный фильтр, то просто удаляем из массива
            setCustomFilters(prev => ({ ...prev, [filterType]: [...prev[filterType].filter(el => el !== filterBox)]}))
          }
        }
        else {
          // если фильтр не checked, то добавляем
          setCustomFilters(prev => ({ ...prev, [filterType]: [...prev[filterType], filterBox]}))
        }
      } else {
        //если еще не фильтровалась эта категория, то ставим флаг на true и перезаписываем соответствующий массив
        setIsFiltered(prev => ({...prev, [filterType]: true}))
        setCustomFilters(prev => ({ ...prev, [filterType]: [filterBox]}))
      }
    }
    if (((filterType === 'prices') || (filterType === 'stock')) && (sliderValue !== undefined)) {
      setCustomFilters(prev => ({ ...prev, [filterType]: sliderValue}))
    }

  }

  useEffect(() => {
    Object.entries(customFilters).forEach(([filterType, value]) => {
      if (!(Array.isArray(value))) {
        return;
      }
      // if ((filterType === 'categories' && !isInitialCategoryFiltered) ||
      //     (filterType === 'brands') && !isInitialBrandFiltered) {
      //   return;
      // }
      console.log('filterType', filterType, 'value', value);
      if (value.length > 0) {
        searchParams.set(`${filterType}`, `${value.join('↕')}`);
      } else {
        searchParams.delete(filterType);
      }
      setSearchParams(searchParams);
    })
  }, [customFilters]);

  const onReset = () => {
    setCustomFilters(initialFilters)
    setIsFiltered({categories: false, brands: false})
  }

  const itemsToRender = items
    .filter(elem => (customFilters.categories.every(el => el === elem.category)))
    .filter(elem => customFilters.brands.every(el => el === elem.brand))
    .filter(elem => (elem.price >= customFilters.prices[0] && elem.price <= customFilters.prices[1]))
    .filter(elem => (elem.stock >= customFilters.stock[0] && elem.stock <= customFilters.stock[1]))

  return (
    <div className='flex'>
      <Sidebar items={items} onCheck={(type, el) => onFilterClick(type, el)}
      filters={initialFilters} itemsToRender={itemsToRender}
      onReset={() => onReset()} onSliderChange={(type, value) => onFilterClick(type, '', value)}
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
