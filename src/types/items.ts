import { SliderValue } from "./filters";

export interface IItem {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly discountPercentage: number;
  readonly rating: number;
  readonly stock: number;
  readonly brand: string;
  readonly category: string;
  readonly thumbnail: string;
  readonly images: string[];
}

interface IMark {
  readonly style: Record<string, string>;
  readonly label: string;
}

interface IItemStats {
  readonly categoryCounts: Map<string, number>;
  readonly brandCounts: Map<string, number>;
  readonly price: SliderValue;
  readonly stock: SliderValue;
}

export interface InitialItemsStats extends IItemStats {
  readonly categories: string[];
  readonly brands: string[];
  readonly priceValues: Record<number, IMark>;
  readonly stockValues: Record<number, IMark>;
}

export interface FilteredItemsStats extends IItemStats {
  readonly total: number;
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

export type ItemCardSize = "Small" | "Large";

export const isItemCardSize = (value: string): value is ItemCardSize => {
  return value === 'Small' || value === 'Large';
}
