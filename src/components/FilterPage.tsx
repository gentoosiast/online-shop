import React, { useEffect, useState } from 'react';
import { Form, useSearchParams, useLoaderData } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { IItem } from '../types/IItem';
import { ItemCardSize } from '../types/ItemCardSize';
import { SortOption } from '../types/SortOption';
import { IFilters, ISliderFilters } from '../types/filters';
import { fetchData } from '../fetchData';
import { ItemCard } from './ItemCard';
import { Sidebar } from './Sidebar';
// import featherSprite from 'feather-icons/dist/feather-sprite.svg';
import { Input } from "@material-tailwind/react";
import Grid4 from "../assets/grid4.svg?component";
import Grid9 from "../assets/grid9.svg?component";
// import { Select, Option } from "@material-tailwind/react";
// import type { SelectProps } from "@material-tailwind/react";

type SortFn = (itemA: IItem, itemB: IItem) => number;
interface ISortFnObj {
  [fnName: string]: SortFn;
}

const searchItemFields = (item: IItem, searchString: string): boolean => {
  if (searchString.length === 0) {
    return true;
  }

  for (const [key, value] of Object.entries(item)) {
    if (['id', 'thumbnail', 'images'].includes(key)) {
      continue;
    }

    if ((typeof value === 'string' || typeof value === 'number') &&
      value.toString().toLowerCase().includes(searchString.toLowerCase())) {
      return true;
    }
  }

  return false;
}

const sortFuncs: ISortFnObj  = {
  'price-ASC': (itemA, itemB) => itemA.price - itemB.price,
  'price-DESC': (itemA, itemB) => itemB.price - itemA.price,
  'rating-ASC': (itemA, itemB) => itemA.rating - itemB.rating,
  'rating-DESC': (itemA, itemB) => itemB.rating - itemA.rating,
  'discount-ASC': (itemA, itemB) => itemA.discountPercentage - itemB.discountPercentage,
  'discount-DESC': (itemA, itemB) => itemB.discountPercentage - itemA.discountPercentage,
};

const isItemCardSize = (value: string): value is ItemCardSize => {
  return value === 'Small' || value === 'Large';
}

const isSortOption = (value: string): value is SortOption => {
  const options = ["price-ASC", "price-DESC", "rating-ASC", "rating-DESC", "discount-ASC", "discount-DESC"];

  return options.includes(value);
}

const fetchItems = async () => {
  // TODO
  // const endpoint = 'https://online-store-backend-production.up.railway.app/products/';
  // TODO 2: probably IItemsDto is no longer needed
  const endpoint = 'http://localhost:8000/products/';
  try {
    const data = await fetchData<IItem[]>(endpoint);
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
  async (): Promise<IItem[]> => {
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
  const { data: items, isLoading, isFetching } = useQuery({
    ...itemsQuery(),
    initialData,
    staleTime: 1000 * 60 * 5,
  });

  const defaultCardSize = 'Small';
  const cardSearchParam = searchParams.get('card') ?? '';
  const initialCardSize = isItemCardSize(cardSearchParam) ? cardSearchParam : defaultCardSize;
  const [cardSize, setCardSize] = useState<ItemCardSize>(initialCardSize);

  const defaultSortParam = 'rating-DESC';
  const sortSearchParam = searchParams.get('sort') ?? '';
  const initialSortOption = isSortOption(sortSearchParam) ? sortSearchParam : defaultSortParam;

  const [sortOption, setSortOption] = useState(initialSortOption);

  const initialSearchQuery = searchParams.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const initialFilters: IFilters = {
    categories: [...new Set(items.map(item => item.category))],
    brands: [...new Set(items.map(item => item.brand))],
    price: [Math.min(...items.map(item => item.price)), Math.max(...items.map(item => item.price))],
    stock: [Math.min(...items.map(item => item.stock)), Math.max(...items.map(item => item.stock))],
  }

  const categorySearchParam = searchParams.get('categories');
  const brandSearchParam = searchParams.get('brands');
  const priceSearchParam = searchParams.get('price');
  const stockSearchParam = searchParams.get('stock');

  const initialCalcFilters: IFilters = {
    categories: categorySearchParam ? categorySearchParam.split('↕') : [],
    brands: brandSearchParam ? brandSearchParam.split('↕') : [],
    price: priceSearchParam ? priceSearchParam.split('↕').map(el => parseInt(el, 10)) : [],
    stock: stockSearchParam ? stockSearchParam.split('↕').map(el => parseInt(el, 10)) : [],
  }

  const priceMoved = Boolean(priceSearchParam);
  const stockMoved = Boolean(stockSearchParam);
  const considerSliders = (initialCalcFilters.categories.length + initialCalcFilters.brands.length === 0);
  const [calcFilters, setCalcFilters] = useState<IFilters>(initialCalcFilters);
  const [customSliders, setCustomSliders] = useState<ISliderFilters>({price: initialCalcFilters.price, stock: initialCalcFilters.stock})
  const [isUserFiltered, setIsUserFiltered] = useState({price: priceMoved && considerSliders, stock: stockMoved && considerSliders});

  const onFilterClick = (filterType: keyof IFilters, filterBox?: string, sliderValue?: number[]) => {
    if ((filterType === 'categories' || filterType === 'brands') && filterBox !== undefined) {
      if (calcFilters[filterType].includes(filterBox)) {
        if (calcFilters.categories.length + calcFilters.brands.length === 1) {
          setIsUserFiltered({price: Boolean(customSliders.price.length), stock: Boolean(customSliders.stock.length)});
          setCalcFilters(prev => ({ ...prev, [filterType]: [], price: customSliders.price, stock: customSliders.stock}));
        } else {
          setCalcFilters(prev => ({ ...prev, [filterType]: [...prev[filterType].filter(el => el !== filterBox)]}));
        }
      } else {
        setCalcFilters(prev => ({ ...prev, [filterType]: [...prev[filterType], filterBox]}));
        setIsUserFiltered({price: false, stock: false});
      }
    }

    if ((filterType === 'price' || filterType === 'stock') && sliderValue !== undefined) {
      setCalcFilters(prev => ({ ...prev, [filterType]: sliderValue}));
      setCustomSliders(prev => ({ ...prev, [filterType]: sliderValue}));
      setIsUserFiltered(prev => ({ ...prev, [filterType]: true}));
    }
  }

  useEffect(() => {
    Object.entries(calcFilters).forEach(([filterType, value]) => {
      if (!(Array.isArray(value))) {
        return;
      }
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
      price: [],
      stock: [],
    });
    setIsUserFiltered({price: false, stock: false});
    Array.from(searchParams.keys()).forEach((key) => {
      searchParams.delete(key);
    });
    setSearchParams(searchParams);
    setSearchQuery('');
    setSortOption(defaultSortParam);
    setCardSize(defaultCardSize);
  }

  const itemsToRender = items
    .filter((item) => calcFilters.categories.length > 0 ? calcFilters.categories.some((category) => category === item.category) : true)
    .filter((item) => calcFilters.brands.length > 0 ? calcFilters.brands.some((brand) => brand === item.brand) : true)
    .filter((item) => calcFilters.price.length > 0 ? item.price >= calcFilters.price[0] && item.price <= calcFilters.price[1] : true)
    .filter((item) => calcFilters.stock.length > 0 ? item.stock >= calcFilters.stock[0] && item.stock <= calcFilters.stock[1] : true)
    .filter((item) => searchItemFields(item, searchQuery))
    .sort(sortFuncs[sortOption])

  if (isLoading || isFetching) {
    return (
      <div className="preloader">Loading</div>
    );
  }

  return (
    <div className='flex'>
      <Sidebar items={items} onCheck={(filterType, value) => onFilterClick(filterType, value)}
        filters={initialFilters} itemsToRender={itemsToRender}
        onReset={() => onReset()} onSliderChange={(filterType, value) => onFilterClick(filterType, '', value)}
        priceLimits={isUserFiltered.price ? calcFilters.price : []}
        stockLimits={isUserFiltered.stock ? calcFilters.stock : []}
        customFilters={calcFilters}
      />
      <div className='filterPage'>
        <div className="filterBar">
          <div>
            <select name="sort"  className='selectInput' value={sortOption} onChange={(event) => {
              if (isSortOption(event.target.value)) {
                setSortOption(event.target.value);
                searchParams.set('sort', event.target.value);
                setSearchParams(searchParams);
              }
            }}>
              <option value="price-ASC">по цене ↑</option>
              <option value="price-DESC">по цене ↓</option>
              <option value="rating-ASC">по рейтингу ↑</option>
              <option value="rating-DESC">по рейтингу ↓</option>
              <option value="discount-ASC">по скидке ↑</option>
              <option value="discount-DESC">по скидке ↓</option>
            </select>
            {/* <Select label="Сортировать по:"
            value={sortOption}
            onChange={(value) => {
              if (isSortOption(value)) {
                setSortOption(value);
                searchParams.set('sort', value);
                setSearchParams(searchParams);
              }
            }}
            >
              <Option value="price-ASC">Sort by price (ascending)</Option>
              <Option value="price-DESC">Sort by price (descending)</Option>
              <Option value="rating-ASC">Sort by rating (ascending)</Option>
              <Option value="rating-DESC">Sort by rating (ascending)</Option>
              <Option value="discount-ASC">Sort by discount (ascending)</Option>
              <Option value="discount-DESC">Sort by discount (descending)</Option>
          </Select> */}
          </div>
          <div>Найдено: {itemsToRender.length} шт.</div>
          <Form id="search-form" role="search" autoComplete="off">
            <Input id="q" className="form-input" name="q" type='search' label="Я ищу..." color='green'
              value={searchQuery} aria-label="Search items"
              onChange={(event) => {
                event.preventDefault();
                setSearchQuery(event.target.value);
                if (event.target.value.length > 0) {
                  searchParams.set('q', event.target.value);
                } else {
                  searchParams.delete('q');
                }
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
              <Grid9 className={`${cardSize === "Small" ? 'fill-green-500': ''}`}/>
            </button>
            <button
              onClick={() => {
                searchParams.set('card', 'Large');
                setSearchParams(searchParams);
                setCardSize("Large");
              }
            }>
              <Grid4 className={`${cardSize === "Large" ? 'fill-green-500': ''}`}/>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {itemsToRender.length > 0 && itemsToRender.map(item => <ItemCard key={item.id} item={item} size={cardSize} />)}
          {itemsToRender.length === 0 && <div className="text-xl py-10">По Вашему запросу ничего не найдено.</div>}
        </div>
      </div>
    </div>
  )
}
