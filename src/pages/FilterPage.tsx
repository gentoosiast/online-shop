import React, { useEffect, useState, useMemo } from 'react';
import { Form, useSearchParams, useLoaderData } from 'react-router-dom';
import { useQuery, QueryClient } from '@tanstack/react-query';
import { useDebouncedCallback } from 'use-debounce';
import { Input } from "@material-tailwind/react";
import { API_ROOT } from '../utils/environment';
import { fetchData } from '../utils/fetchData';
import { ItemCard } from '../components/ItemCard';
import { Sidebar } from '../components/Sidebar';
import { IItem, isIItem, InitialItemsStats, FilteredItemsStats, ItemCardSize, isItemCardSize } from '../types/items';
import { IFilters, ValueDivider, SliderValue, isSliderValue, SortOption, isSortOption } from '../types/filters';
import Grid4Icon from "../assets/grid4.svg?component";
import Grid9Icon from "../assets/grid9.svg?component";
import styles from "../css/filterpage.module.css";
import { ScrollToTop } from '../components/Scroll'

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

const fetchItems = async () => {
  const endpoint = `${API_ROOT}/products/`;
  try {
    const data = await fetchData<IItem[]>(endpoint);
    return data.filter((item) => isIItem(item));
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
  // NOTE: use of this type assertion recommended by author of React-Query
  // https://tkdodo.eu/blog/react-query-meets-react-router#a-typescript-tip
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof loader>>
  >
  const { data: items } = useQuery({
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

  const defaultCardSize: ItemCardSize = 'Small';
  const cardSearchParam = searchParams.get('card') ?? '';
  const cardSize = isItemCardSize(cardSearchParam) ? cardSearchParam : defaultCardSize;

  const defaultSortParam: SortOption = 'rating-DESC';
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
      priceValues: {},
      stockValues: {},
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

      if (!(item.price in stats.priceValues)) {
        stats.priceValues[item.price] = {
          style: { display: 'none' },
          label: `${item.price}`,
        };
      }

      if (!(item.stock in stats.stockValues)) {
        stats.stockValues[item.stock] = {
          style: { display: 'none' },
          label: `${item.stock}`,
        };
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
      price: null,
      stock: null,
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
    .filter((item) => filters.price ? item.price >= filters.price[0] && item.price <= filters.price[1] : true)
    .filter((item) => filters.stock ? item.stock >= filters.stock[0] && item.stock <= filters.stock[1] : true)
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

  return (
    <div className='flex'>
      <Sidebar initialItemsStats={initialItemsStats} filteredItemsStats={filteredItemsStats} filters={filters}
        onFilterChange={(filterType, value) => handleFilterChange(filterType, value)}
        onReset={() => onReset()}
      />
      <div className='filterPage'>
        <div className="filterBar">
          <div>
            <select name="sort"  className='selectInput' value={sortOption} onChange={(event) => {
              if (isSortOption(event.target.value)) {
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
          </div>
          <div className='w-36'>Найдено: {filteredItemsStats.total} шт.</div>
          <Form id="search-form" role="search" autoComplete="off">
            <Input id="q" className="form-input" name="q" type='search' label="Я ищу..." color='green'
              value={searchQuery} aria-label="Поиск по товарам"
              onChange={(event) => {
                event.preventDefault();
                setSearchQuery(event.target.value);
                debounceSearchField(event.target.value);
              }} />
          </Form>
          <div className="flex gap-2">
            <button
              className={cardSize === "Small" ? styles.gridButtonActive : ''}
              aria-label="Переключиться на маленькие карточки товаров"
              onClick={() => {
                searchParams.set('card', 'Small');
                setSearchParams(searchParams);
              }
            }>
              <Grid9Icon className={cardSize === "Small" ? styles.gridIconActive : styles.gridIcon } />
            </button>
            <button
              className={cardSize === "Large" ? styles.gridButtonActive : ''}
              aria-label="Переключиться на большие карточки товаров"
              onClick={() => {
                searchParams.set('card', 'Large');
                setSearchParams(searchParams);
              }
            }>
              <Grid4Icon className={cardSize === "Large" ? styles.gridIconActive : styles.gridIcon } />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-5">
          {filteredItems.length > 0 && filteredItems.map(item => <ItemCard key={item.id} item={item} size={cardSize} />)}
          {filteredItems.length === 0 && <div className="text-xl py-10">По Вашему запросу ничего не найдено.</div>}
        </div>
      </div>
      <ScrollToTop/>
    </div>
  )
}
