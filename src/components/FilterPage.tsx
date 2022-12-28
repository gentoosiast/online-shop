import React, { useEffect, useState } from 'react';
import { Form, useSearchParams, useLoaderData } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { IItemsDto } from '../types/IItem';
import { ItemCardSize } from '../types/ItemCardSize';
import { SortOption } from '../types/SortOption';
import { IFilters, ISliderFilters } from '../types/filters';
import { fetchData } from '../fetchData';
import { ItemCard } from './ItemCard';
import { Sidebar } from './Sidebar';
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
  }

  const itemsToRender = items
    .filter((item) => calcFilters.categories.length > 0 ? calcFilters.categories.some((category) => category === item.category) : true)
    .filter((item) => calcFilters.brands.length > 0 ? calcFilters.brands.some((brand) => brand === item.brand) : true)
    .filter((item) => calcFilters.price.length > 0 ? item.price >= calcFilters.price[0] && item.price <= calcFilters.price[1] : true)
    .filter((item) => calcFilters.stock.length > 0 ? item.stock >= calcFilters.stock[0] && item.stock <= calcFilters.stock[1] : true)

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
          <div>Found: {itemsToRender.length} item(s)</div>
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
          {itemsToRender.length > 0 && itemsToRender.map(item => <ItemCard key={item.id} item={item} size={cardSize} />)}
          {itemsToRender.length === 0 && <div className="text-5xl">No products found</div>}
        </div>
      </div>
    </div>
  )
}
