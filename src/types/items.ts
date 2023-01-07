import { SliderValue } from "./SliderValue";

export interface IItem {
  id: number,
  title: string,
  description: string,
  price: number,
  discountPercentage: number,
  rating: number,
  stock: number,
  brand: string,
  category: string,
  thumbnail: string,
  images: string []
}

export interface IItemsDto {
  products: IItem []
  total: number
  skip: number
  limit: number
}

interface IMark {
  style: Record<string, string>;
  label: string;
}

export interface InitialItemsStats {
  categories: string[],
  brands: string[],
  categoryCounts: Map<string, number>,
  brandCounts: Map<string, number>,
  priceValues: Record<number, IMark>,
  stockValues: Record<number, IMark>,
  price: SliderValue,
  stock: SliderValue,
}

export interface FilteredItemsStats {
  total: number,
  categoryCounts: Map<string, number>,
  brandCounts: Map<string, number>,
  price: SliderValue,
  stock: SliderValue,
}
