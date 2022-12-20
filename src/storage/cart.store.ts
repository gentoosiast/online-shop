import { makeObservable, observable, action, computed } from 'mobx';
import { IItem } from '../types/IItem';
import { CartItems, TPromo, TPromocodes } from '../types/cart';

class CartStore {
  items: CartItems = new Map();
  promos: TPromocodes = new Set();

  constructor() {
    makeObservable(this, {
      items: observable,
      promos: observable,
      addItem: action,
      removeItem: action,
      addPromo: action,
      removePromo: action,
      clear: action,
      totalItems: computed,
      totalPrice: computed,
      finalPrice: computed, // after all promocodes has been applied
    });
  }

  addItem = (item: IItem) => {
    if (this.items.has(item)) {
      // https://stackoverflow.com/questions/70723319/object-is-possibly-undefined-using-es6-map-get-right-after-map-set
      const curQty = this.items.get(item) ?? 0;
      this.items.set(item, curQty + 1);
    } else {
      this.items.set(item, 1);
    }
  }

  removeItem = (item: IItem) => {
    if (this.items.has(item)) {
      const curQty = this.items.get(item) ?? 0;
      curQty === 1 ? this.items.delete(item) : this.items.set(item, curQty - 1);
    }
  }

  addPromo = (promo: TPromo) => {
    this.promos.add(promo);
  }

  removePromo = (promo: TPromo) => {
    this.promos.delete(promo);
  }

  clear = () => {
    this.items.clear();
  }

  get totalItems() {
    return this.items.size;
  }

  get totalPrice() {
    return Array.from(this.items).reduce((acc, entry) => acc + entry[0].price * entry[1], 0);
  }

  get finalPrice() {
    const percentDiscount = Array.from(this.promos).reduce((acc, entry) => acc + entry[1], 0);

    return Math.round(this.totalPrice - this.totalPrice / 100 * percentDiscount);
  }
}

export const cartStore = new CartStore();
