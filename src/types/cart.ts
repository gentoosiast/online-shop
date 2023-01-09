import { IItem, isIItem } from "./items";

export interface CartItem {
  readonly item: IItem;
  quantity: number;
}

export const isCartItem = (value: unknown): value is CartItem => {
  if (!(value && typeof value === 'object')) {
    return false;
  }

  if ('item' in value && isIItem(value.item) &&
      'quantity' in value && typeof value.quantity === 'number') {
    return true;
  }

  return false;
}

export type CartItems = Map<number, CartItem>;

export type CartEntry = [number, CartItem];

export const isCartEntry = (value: unknown): value is CartEntry => {
  if (!(value && Array.isArray(value))) {
    return false;
  }

  if (value.length === 2 && typeof value[0] === 'number' && isCartItem(value[1])) {
    return true;
  }

  return false;
}

export const isCartEntries = (value: unknown): value is CartEntries => {
  if (!(value && Array.isArray(value))) {
    return false;
  }

  return value.every((el) => isCartEntry(el));
}

export type CartEntries = CartEntry[];
