import { makeObservable, observable, action, computed } from 'mobx';
import { IItem } from '../types/IItem';
import { CartItems, TPromo, TPromocodes } from '../types/cart';

const availablePromos: TPromo[] = [['NOWAR', 15], ['RSSCHOOL', 5], ['NEWYEAR', 10]];

class CartStore {
  items: CartItems = new Map();
  promos: TPromocodes = new Set();

  constructor() {
    makeObservable(this, {
      items: observable,
      promos: observable.shallow,
      addItem: action,
      removeOneItem: action,
      removeAllItems: action,
      addPromo: action,
      removePromo: action,
      clear: action,
      totalItems: computed,
      totalPrice: computed,
      finalPrice: computed, // after all promocodes has been applied
    });
  }

  isInCart = (id: number) => {
    return this.items.has(id);
  }

  isEnoughInStock = (id: number) => {
    const cartItem = this.items.get(id);

    if (!cartItem) {
      return true;
    }

    return cartItem.quantity < cartItem.item.stock;
  }

  addItem = (item: IItem) => {
    if (!this.isEnoughInStock(item.id)) {
      return;
    }

    const cartItem = this.items.get(item.id) ?? { item, quantity: 0 };
    cartItem.quantity += 1;
    this.items.set(item.id, cartItem);
  }

  removeAllItems = (id: number) => {
    this.items.delete(id);
  }

  removeOneItem = (id: number) => {
    const cartItem = this.items.get(id);
    if (!cartItem) {
      return;
    }

    if (cartItem.quantity === 1) {
      this.items.delete(id);
    } else {
      cartItem.quantity -= 1;
      this.items.set(id, cartItem);
    }
  }

  private findPromoByName(promoName: string) {
    return availablePromos.find((promo) => promo[0] === promoName.toUpperCase());
  }

  isPromoOK = (promoName: string) => {
    const promo = this.findPromoByName(promoName);
    const isPromoApplied = promo && this.promos.has(promo);

    return promo && !isPromoApplied;
  }

  showPromo = (promoName: string) => {
    return this.findPromoByName(promoName) ?? ['', 0];
  }

  addPromo = (promoName: string) => {
    const promo = this.findPromoByName(promoName);
    if (promo) {
      this.promos.add(promo);
    }
  }

  removePromo = (promo: TPromo) => {
    this.promos.delete(promo);
  }

  clear = () => {
    this.items.clear();
    this.promos.clear();
  }

  get totalItems() {
    return Array.from(this.items).reduce((acc, entry) => acc + entry[1].quantity, 0);
  }

  get totalPrice() {
    return Array.from(this.items).reduce((acc, entry) => acc + entry[1].item.price * entry[1].quantity, 0);
  }

  get finalPrice() {
    const percentDiscount = Array.from(this.promos).reduce((acc, entry) => acc + entry[1], 0);
    return Math.round((100 - percentDiscount) / 100 * this.totalPrice);
  }
}

export const cartStore = new CartStore();

// autorun (() => {
//   for (const [key, value] of cartStore.items) {
//     console.log(key, value);
//   }
// })
