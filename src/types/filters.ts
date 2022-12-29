export interface IFilters {
  categories: string[];
  brands: string[];
  price: number[];
  stock: number[];
}

export type ICheckboxFilters = Pick<IFilters, 'categories' | 'brands'>
export type ISliderFilters = Pick<IFilters, 'price' | 'stock'>
