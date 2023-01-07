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

interface IItemStats {
  categoryCounts: Map<string, number>;
  brandCounts: Map<string, number>;
  price: SliderValue;
  stock: SliderValue;
}

export interface InitialItemsStats extends IItemStats {
  categories: string[],
  brands: string[],
  priceValues: Record<number, IMark>,
  stockValues: Record<number, IMark>,
}

export interface FilteredItemsStats extends IItemStats {
  total: number;
}
