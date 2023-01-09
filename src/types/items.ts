import { SliderValue } from "./filters";

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

export const isIItem = (value: unknown): value is IItem => {
  if (!(value && typeof value === 'object')) {
    return false;
  }

  if ('id' in value && typeof value.id === 'number' &&
      'title' in value && typeof value.title === 'string' &&
      'description' in value && typeof value.description === 'string' &&
      'price' in value && typeof value.price === 'number' &&
      'discountPercentage' in value && typeof value.discountPercentage === 'number' &&
      'rating' in value && typeof value.rating === 'number' &&
      'stock' in value && typeof value.stock === 'number' &&
      'brand' in value && typeof value.brand === 'string' &&
      'category' in value && typeof value.category === 'string' &&
      'thumbnail' in value && typeof value.thumbnail === 'string' &&
      'images' in value && Array.isArray(value.images) &&
      value.images.every((image) => typeof image === 'string')) {
    return true;
  }

  return false;
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

export type ItemCardSize = "Small" | "Large";

export const isItemCardSize = (value: string): value is ItemCardSize => {
  return value === 'Small' || value === 'Large';
}
