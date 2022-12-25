import { makeObservable, observable, action, computed, autorun } from 'mobx';
import { PersistentStorage } from './persistentStorage';
import { IItem } from '../types/IItem';
import { CartItem, CartItems, TPromo, TPromocodes } from '../types/cart';

const availablePromos: TPromo[] = [['NOWAR', 15], ['RSSCHOOL', 5], ['NEWYEAR', 10]];

const isIItem = (value: unknown): value is IItem => {
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

const isCartItem = (value: unknown): value is CartItem => {
  if (!(value && typeof value === 'object')) {
    return false;
  }

  if ('item' in value && isIItem(value.item) &&
      'quantity' in value && typeof value.quantity === 'number') {
    return true;
  }

  return false;
}

type CartEntry = [number, CartItem];
type CartEntries = CartEntry[];

const isCartEntry = (value: unknown): value is CartEntry => {
  if (!(value && Array.isArray(value))) {
    return false;
  }

  if (value.length === 2 && typeof value[0] === 'number' && isCartItem(value[1])) {
    return true;
  }

  return false;
}

const isCartEntries = (value: unknown): value is CartEntries => {
  if (!(value && Array.isArray(value))) {
    return false;
  }

  return value.every((el) => isCartEntry(el));
}

class CartStore {
  items: CartItems;
  promos: TPromocodes = new Set();
  storage: PersistentStorage;

  constructor() {
    this.storage = new PersistentStorage('gentoosiast😺-sinastya🥇');
    const storageCart = this.storage.get('cart');
    if (isCartEntries(storageCart)) {
      this.items = new Map(storageCart);
    } else {
      this.items = new Map();
    }

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
autorun(() => {
  cartStore.storage.set('cart', cartStore.items);
});
