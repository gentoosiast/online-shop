import { IItem } from "./IItem";

export type CartItems = Map<IItem, number>;

export type TPromo = [string, number];
export type TPromocodes = Set<TPromo>;
