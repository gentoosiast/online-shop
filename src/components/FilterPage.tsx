import React, { useEffect, useState, useMemo } from 'react';
import { Form, useSearchParams, useLoaderData } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { IItem, InitialItemsStats, FilteredItemsStats } from '../types/items';
import { ItemCardSize } from '../types/ItemCardSize';
import { SortOption } from '../types/SortOption';
import { SliderValue } from '../types/SliderValue';
import { IFilters, ValueDivider } from '../types/filters';
import { fetchData } from '../fetchData';
import { ItemCard } from './ItemCard';
import { Sidebar } from './Sidebar';
import featherSprite from 'feather-icons/dist/feather-sprite.svg';

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

const isSliderValue = (value: unknown): value is SliderValue => {
  if (!Array.isArray(value) || value.length !== 2 ||
    !value.every((v) => typeof v === 'number' && !Number.isNaN(v)) || value[0] > value[1]) {
    return false;
  }

  return true;
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

  const debounceSearchField = useDebouncedCallback(
    (searchValue: string) => {
      if (searchValue.length > 0) {
        searchParams.set('q', searchValue);
      } else {
        searchParams.delete('q');
      }
      setSearchParams(searchParams);
    }, 800
  );

  const defaultCardSize = 'Small';
  const cardSearchParam = searchParams.get('card') ?? '';
  const cardSize = isItemCardSize(cardSearchParam) ? cardSearchParam : defaultCardSize;

  const defaultSortParam = 'rating-DESC';
  const sortSearchParam = searchParams.get('sort') ?? '';
  const sortOption = isSortOption(sortSearchParam) ? sortSearchParam : defaultSortParam;

  const searchQueryParam = searchParams.get('q') ?? '';
  const [searchQuery, setSearchQuery] = useState(searchQueryParam);
  useEffect(() => {
    setSearchQuery(searchQueryParam);
  }, [searchQueryParam]);

  const calculateInitialItemsStats = (items: IItem[]): InitialItemsStats => {
    const stats: InitialItemsStats = {
      categories: [],
      brands: [],
      categoryCounts: new Map(),
      brandCounts: new Map(),
      price: [Infinity, -Infinity],
      stock: [Infinity, -Infinity],
    };

    items.forEach((item) => {
      if (!stats.categories.includes(item.category)) {
        stats.categories.push(item.category);
      }

      if (!stats.brands.includes(item.brand)) {
        stats.brands.push(item.brand);
      }

      const categoryCount = stats.categoryCounts.get(item.category) ?? 0;
      const brandCount = stats.brandCounts.get(item.brand) ?? 0;
      stats.categoryCounts.set(item.category, categoryCount + 1);
      stats.brandCounts.set(item.brand, brandCount + 1);

      if (item.price < stats.price[0]) {
        stats.price[0] = item.price;
      }

      if (item.price > stats.price[1]) {
        stats.price[1] = item.price;
      }

      if (item.stock < stats.stock[0]) {
        stats.stock[0] = item.stock;
      }

      if (item.stock > stats.stock[1]) {
        stats.stock[1] = item.stock;
      }
    });

    stats.categories.sort();
    stats.brands.sort();

    return stats;
  }

  const initialItemsStats = useMemo(() => calculateInitialItemsStats(items), [items]);

  const calculateFiltersFromSearchParams = (searchParams: URLSearchParams): IFilters => {
    const filters: IFilters = {
      categories: [],
      brands: [],
      price: [-Infinity, Infinity],
      stock: [-Infinity, Infinity],
    };

    const categorySearchParam = searchParams.get('categories');
    const brandSearchParam = searchParams.get('brands');
    const priceSearchParam = searchParams.get('price');
    const stockSearchParam = searchParams.get('stock');

    if (categorySearchParam) {
      const categories = categorySearchParam.split(ValueDivider);
      categories.forEach((category) => {
        if (!filters.categories.includes(category) && initialItemsStats.categories.includes(category))
          filters.categories.push(category);
      });
    }

    if (brandSearchParam) {
      const brands = brandSearchParam.split(ValueDivider);
      brands.forEach((brand) => {
        if (!filters.brands.includes(brand) && initialItemsStats.brands.includes(brand))
          filters.brands.push(brand);
      });
    }

    if (priceSearchParam) {
      const price = priceSearchParam.split(ValueDivider).map(el => parseInt(el, 10));
      if (isSliderValue(price)) {
        filters.price = price;
      }
    }

    if (stockSearchParam) {
      const stock = stockSearchParam.split(ValueDivider).map(el => parseInt(el, 10));
      if (isSliderValue(stock)) {
        filters.stock = stock;
      }
    }

    return filters;
  }

  const filters: IFilters = calculateFiltersFromSearchParams(searchParams);

  const updateSearchParams = (filterType: keyof IFilters, filterValue: string[] | SliderValue) => {
    if (filterValue.length > 0) {
      searchParams.set(filterType, `${filterValue.join(ValueDivider)}`);
    } else {
      searchParams.delete(filterType);
    }
    setSearchParams(searchParams);
  }

  const handleFilterChange = (filterType: keyof IFilters, filterValue: string | SliderValue) => {
    if ((filterType === 'categories' || filterType === 'brands') && typeof filterValue === 'string') {
      if (filters[filterType].includes(filterValue)) { // uncheck checkobox
        const newFilterTypeValue = filters[filterType].filter((value) => value !== filterValue);
        updateSearchParams(filterType, newFilterTypeValue);
      } else {
        updateSearchParams(filterType, [...filters[filterType], filterValue]);
      }
    }

    if ((filterType === 'price' || filterType === 'stock') && isSliderValue(filterValue)) {
      updateSearchParams(filterType, filterValue);
    }
  }

  const onReset = () => {
    setSearchParams({});
  }

  const filteredItems = useMemo(() => ([...items])
    .filter((item) => filters.categories.length > 0 ? filters.categories.some((category) => category === item.category) : true)
    .filter((item) => filters.brands.length > 0 ? filters.brands.some((brand) => brand === item.brand) : true)
    .filter((item) => item.price >= filters.price[0] && item.price <= filters.price[1])
    .filter((item) => item.stock >= filters.stock[0] && item.stock <= filters.stock[1])
    .filter((item) => searchItemFields(item, searchQuery))
    .sort(sortFuncs[sortOption])
  , [filters, items, sortOption, searchQuery]);


  const calculateFilteredItemsStats = (items: IItem[]): FilteredItemsStats => {
    const stats: FilteredItemsStats = {
      total: items.length,
      categoryCounts: new Map(),
      brandCounts: new Map(),
      price: [Infinity, -Infinity],
      stock: [Infinity, -Infinity],
    };

    items.forEach((item) => {
      const categoryCount = stats.categoryCounts.get(item.category) ?? 0;
      const brandCount = stats.brandCounts.get(item.brand) ?? 0;
      stats.categoryCounts.set(item.category, categoryCount + 1);
      stats.brandCounts.set(item.brand, brandCount + 1);

      if (item.price < stats.price[0]) {
        stats.price[0] = item.price;
      }

      if (item.price > stats.price[1]) {
        stats.price[1] = item.price;
      }

      if (item.stock < stats.stock[0]) {
        stats.stock[0] = item.stock;
      }

      if (item.stock > stats.stock[1]) {
        stats.stock[1] = item.stock;
      }
    });

    return stats;
  }

  const filteredItemsStats = useMemo(() => calculateFilteredItemsStats(filteredItems), [filteredItems]);

  if (isLoading || isFetching) {
    return (
      <div className="preloader">Loading</div>
    );
  }

  return (
    <div className='flex'>
      <Sidebar initialItemsStats={initialItemsStats} filteredItemsStats={filteredItemsStats} filters={filters}
        onFilterChange={(filterType, value) => handleFilterChange(filterType, value)}
        onReset={() => onReset()}
      />
      <div className="flex flex-col gap-2">
        <div className="flex justify-center items-center gap-10">
          <div>
            <select name="sort" value={sortOption} onChange={(event) => {
              if (isSortOption(event.target.value)) {
                searchParams.set('sort', event.target.value);
                setSearchParams(searchParams);
              }
            }}>
              <option value="price-ASC">Sort by price (ascending)</option>
              <option value="price-DESC">Sort by price (descending)</option>
              <option value="rating-ASC">Sort by rating (ascending)</option>
              <option value="rating-DESC">Sort by rating (descending)</option>
              <option value="discount-ASC">Sort by discount (ascending)</option>
              <option value="discount-DESC">Sort by discount (descending)</option>
            </select>
          </div>
          <div>Found: {filteredItemsStats.total} item(s)</div>
          <Form id="search-form" role="search" autoComplete="off">
            <input id="q" className="form-input" name="q" type='search' placeholder="I'm looking for..."
              value={searchQuery} aria-label="Search items"
              onChange={(event) => {
                event.preventDefault();
                setSearchQuery(event.target.value);
                debounceSearchField(event.target.value);
              }} />
          </Form>
          <div className="flex gap-2">
            <button
              onClick={() => {
                searchParams.set('card', 'Small');
                setSearchParams(searchParams);
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
              }
            }>
              <svg className={`feather grid-icon border-2 ${cardSize === "Large" ? 'border-slate-700' : 'border-transparent'}`}>
                <use href={`${featherSprite}#grid`} />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {filteredItems.length > 0 && filteredItems.map(item => <ItemCard key={item.id} item={item} size={cardSize} />)}
          {filteredItems.length === 0 && <div className="text-5xl">No products found</div>}
        </div>
      </div>
    </div>
  )
}
