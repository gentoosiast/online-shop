import { makeObservable, observable, action, computed, autorun } from 'mobx';
import { PersistentStorage } from './persistentStorage';
import { IItem } from '../types/IItem';
import { CartItem, CartItems } from '../types/cart';

const availablePromos = new Map([['NOWAR', 15], ['RSSCHOOL', 5], ['NEWYEAR', 10]]);

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

const validateStoragePromos = (promos: unknown): string[] => {
  const validatedPromos: string[] = [];

  if (!(promos && Array.isArray(promos))) {
    return validatedPromos;
  }

  promos.forEach((promo) => {
    if (typeof promo === 'string' && availablePromos.has(promo)) {
      validatedPromos.push(promo);
    }
  });

  return validatedPromos;
}

class CartStore {
  items: CartItems;
  promos: Set<string>;
  storage: PersistentStorage;

  constructor() {
    this.storage = new PersistentStorage('gentoosiast😺-sinastya🥇');
    const storageCart = this.storage.get('cart');
    if (isCartEntries(storageCart)) {
      this.items = new Map(storageCart);
    } else {
      this.items = new Map();
    }

    const storagePromos = this.storage.get('promos');
    this.promos = new Set(validateStoragePromos(storagePromos));

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

  isPromoOK = (promoName: string) => {
    return availablePromos.has(promoName) && !this.promos.has(promoName);
  }

  showPromo = (promoName: string) => {
    const promoValue = availablePromos.get(promoName);

    if (!promoValue) {
      return ""; // should never happen, this method always invoked after isPromoOk()
    }

    return `${promoName} - ${promoValue}%`;
  }

  addPromo = (promoName: string) => {
    if (availablePromos.has(promoName)) {
      this.promos.add(promoName);
    }
  }

  removePromo = (promoName: string) => {
    this.promos.delete(promoName);
  }

  clear = () => {
    this.items.clear();
    this.promos.clear();
    this.storage.remove('cart');
    this.storage.remove('promos');
  }

  get totalItems() {
    return Array.from(this.items).reduce((acc, entry) => acc + entry[1].quantity, 0);
  }

  get totalPrice() {
    return Array.from(this.items).reduce((acc, entry) => acc + entry[1].item.price * entry[1].quantity, 0);
  }

  get finalPrice() {
    const percentDiscount = Array.from(this.promos).reduce((acc, promoName) => {
      const promoValue = availablePromos.get(promoName) ?? 0;
      return acc + promoValue;
    }, 0);
    return Math.round((100 - percentDiscount) / 100 * this.totalPrice);
  }
}

export const cartStore = new CartStore();

autorun(() => {
  cartStore.storage.set('cart', cartStore.items);
  cartStore.storage.set('promos', cartStore.promos);
});
