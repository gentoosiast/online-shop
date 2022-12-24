import { IItem } from "./IItem";

export interface CartItem {
  item: IItem;
  quantity: number;
}

export type CartItems = Map<number, CartItem>;

export type TPromo = [string, number];
export type TPromocodes = Set<TPromo>;
