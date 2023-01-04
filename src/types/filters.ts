import { SliderValue } from './SliderValue';

export interface IFilters {
  categories: string[];
  brands: string[];
  price: SliderValue;
  stock: SliderValue;
}

export type ICheckboxFilters = Pick<IFilters, 'categories' | 'brands'>
export type ISliderFilters = Pick<IFilters, 'price' | 'stock'>

export const ValueDivider = '↕';
