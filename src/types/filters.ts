export interface IFilters {
  readonly categories: string[];
  readonly brands: string[];
  price: SliderValue | null;
  stock: SliderValue | null;
}

export type ICheckboxFilters = Pick<IFilters, 'categories' | 'brands'>;
export type ISliderFilters = Pick<IFilters, 'price' | 'stock'>;

export const ValueDivider = '↕';

export type SliderValue = [number, number];

export const isSliderValue = (value: unknown): value is SliderValue => {
  if (!Array.isArray(value) || value.length !== 2 ||
    !value.every((v) => typeof v === 'number' && !Number.isNaN(v)) || value[0] > value[1]) {
    return false;
  }

  return true;
}

export type SortOption = "price-ASC" | "price-DESC" | "rating-ASC" | "rating-DESC" | "discount-ASC" | "discount-DESC";

export const isSortOption = (value: string): value is SortOption => {
  const options = ["price-ASC", "price-DESC", "rating-ASC", "rating-DESC", "discount-ASC", "discount-DESC"];

  return options.includes(value);
}

