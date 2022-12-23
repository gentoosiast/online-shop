import { makeObservable, observable, action, computed, autorun } from 'mobx';
import { IItem } from '../types/IItem';
import { CartItems, TPromo, TPromocodes } from '../types/cart';

const availablePromos: TPromo[] = [['NOWAR', 15], ['RSSCHOOL', 5], ['NEWYEAR', 10]];

class CartStore {
  items: CartItems = new Map();
  promos: TPromocodes = new Set();

  constructor() {
    makeObservable(this, {
      items: observable,
      promos: observable,
      addItem: action,
      removeOneItem: action,
      removeAllItems: action,
      isPromoOK: action,
      showPromo: action,
      addPromo: action,
      removePromo: action,
      clear: action,
      totalItems: computed,
      totalPrice: computed,
      finalPrice: computed, // after all promocodes has been applied
      promoList: computed,
    });
  }


  isInCart = (item: IItem) => {
    const elemToSeak = Array.from(this.items).find(el => el[0].id === item.id);
    if (elemToSeak !== undefined) return true
    return false
  }

  getItemCopy = (item: IItem) => {
    const elemToSeak = Array.from(this.items).find(el => el[0].id === item.id);
    if (elemToSeak !== undefined) return elemToSeak[0]
    return Array.from(this.items)[0][0]; // кукаю-то глупость вписала, потому что не знаю, как дать понять ТС, что там нет undefined
  }

  isEnoughInStock = (item: IItem) => {
    const elemToSeak = Array.from(this.items).find(el => el[0].id === item.id);
    if (elemToSeak !== undefined) {
      const curQty = this.items.get(this.getItemCopy(item)) ?? 0;
      return (elemToSeak[0].stock>curQty) ? true : false
    }
    return false;
  }

  addItem = (item: IItem) => {
    if (this.isInCart(item)) {
      // https://stackoverflow.com/questions/70723319/object-is-possibly-undefined-using-es6-map-get-right-after-map-set
      const curQty = this.items.get(this.getItemCopy(item)) ?? 0;
      if (this.isEnoughInStock(item)) this.items.set(item, curQty + 1);
    } else {
      this.items.set(item, 1);
    }
  }

  removeAllItems = (item: IItem) => {
    if (this.isInCart(item)) {
      this.items.delete(this.getItemCopy(item))
    }
  }
  removeOneItem = (item: IItem) => {
    if (this.isInCart(item)) {
      const curQty = this.items.get(this.getItemCopy(item)) ?? 0
      curQty === 1 ? this.items.delete(item) : this.items.set(item, curQty - 1);
    }
  }

  isPromoOK = (promoName: string) => {
    const promoAvailable = availablePromos.find((promo) => promo[0] === promoName);
    const isPromoInList = (this.promoList.indexOf(promoName)>=0) ? true : false;
    return (promoAvailable && !isPromoInList) ? true : false;
  }

  showPromo = (promoName: string) => {
    return (this.isPromoOK(promoName)) ? availablePromos.filter(el=>el[0]===promoName)[0] : ['', 0];
  }

  addPromo = (promoName: string) => {
    const promoAvailable = availablePromos.find((promo) => promo[0] === promoName);
    if (promoAvailable) this.promos.add(promoAvailable)
  }

  removePromo = (promoName: TPromo) => {
    this.promos.delete(promoName)
  }

  clear = () => {
    this.items.clear();
    this.promos.clear();
  }

  get totalItems() {
    return Array.from(this.items).reduce((acc, entry) => acc + entry[1], 0);
  }

  get totalPrice() {
    return Array.from(this.items).reduce((acc, entry) => acc + entry[0].price * entry[1], 0);
  }

  get finalPrice() {
    const percentDiscount = Array.from(this.promos).reduce((acc, entry) => acc + entry[1], 0);
    return Math.round((100 - percentDiscount)/100 * this.totalPrice);
  }

  get promoList() {
    return Array.from(this.promos).map(el => el[0]);
  }

}

export const cartStore = new CartStore();

autorun (() => {
  for (const [key, value] of cartStore.items) {
    console.log(key, value);
  }
})
