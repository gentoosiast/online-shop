import { IItem } from "./items";

export interface CartItem {
  item: IItem;
  quantity: number;
}

export type CartItems = Map<number, CartItem>;
