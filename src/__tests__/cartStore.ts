import { CartStore } from '../storage/cart.store';
import { IItem } from '../types/items';

let cartStore: CartStore;

const item1: IItem = {
  "id": 1,
  "title": "iPhone 9",
  "description": "An apple mobile which is nothing like apple",
  "price": 549,
  "discountPercentage": 12.96,
  "rating": 4.69,
  "stock": 2,
  "brand": "Apple",
  "category": "smartphones",
  "thumbnail": "https://i.dummyjson.com/data/products/1/thumbnail.jpg",
  "images": [
    "https://i.dummyjson.com/data/products/1/1.jpg",
    "https://i.dummyjson.com/data/products/1/2.jpg",
    "https://i.dummyjson.com/data/products/1/3.jpg",
    "https://i.dummyjson.com/data/products/1/4.jpg",
    "https://i.dummyjson.com/data/products/1/thumbnail.jpg"
  ]
};

const item2 = {
  "id": 2,
  "title": "iPhone X",
  "description": "SIM-Free, Model A19211 6.5-inch Super Retina HD display with OLED technology A12 Bionic chip with ...",
  "price": 899,
  "discountPercentage": 17.94,
  "rating": 4.44,
  "stock": 34,
  "brand": "Apple",
  "category": "smartphones",
  "thumbnail": "https://i.dummyjson.com/data/products/2/thumbnail.jpg",
  "images": [
    "https://i.dummyjson.com/data/products/2/1.jpg",
    "https://i.dummyjson.com/data/products/2/2.jpg",
    "https://i.dummyjson.com/data/products/2/3.jpg",
    "https://i.dummyjson.com/data/products/2/thumbnail.jpg"
  ]
};

beforeEach(() => {
  cartStore = new CartStore();
});

describe("CartStore", () => {
  it("should create new instance of CartStore class", () => {
    expect(cartStore).toBeInstanceOf(CartStore);
  });

  it("method totalItems() should return 0 for empty store", () => {
    expect(cartStore.totalItems).toBe(0);
  });

  it("method totalPrice() should return 0 for empty store", () => {
    expect(cartStore.totalPrice).toBe(0);
  });

  it("method finalPrice() should return 0 for empty store", () => {
    expect(cartStore.finalPrice).toBe(0);
  });

  it("method isInCart(id) should return false for empty store and arbitrary id", () => {
    expect(cartStore.isInCart(42)).toBe(false);
  });

  it("method addItem(item) should successfully add new item to the store", () => {
    cartStore.addItem(item1);
    expect(cartStore.isInCart(item1.id)).toBe(true);
    expect(cartStore.totalItems).toBe(1);
  });

  it("method addItem(item) should allow to add more than one item of the same type to the store", () => {
    cartStore.addItem(item1);
    cartStore.addItem(item1);
    expect(cartStore.totalItems).toBe(2);
    expect(cartStore.totalPrice).toBe(item1.price * 2);
  });

  it("method addItem(item) should not add new item to the store if it is out of stock", () => {
    cartStore.addItem(item1); // only 2 such items are available in the stock
    cartStore.addItem(item1);
    cartStore.addItem(item1);
    expect(cartStore.totalItems).toBe(2);
  });

  it("method removeOneItem(id) should remove one item from the store", () => {
    cartStore.addItem(item1); // only 2 such items are available in the stock
    cartStore.addItem(item1);
    expect(cartStore.totalItems).toBe(2);
    cartStore.removeOneItem(item1.id);
    expect(cartStore.totalItems).toBe(1);
  });

  it("method removeAllItems(id) should remove all items of the same type from the store", () => {
    cartStore.addItem(item1); // only 2 such items are available in the stock
    cartStore.addItem(item1);
    expect(cartStore.totalItems).toBe(2);
    cartStore.removeAllItems(item1.id);
    expect(cartStore.totalItems).toBe(0);
  });

  it("method clear() should remove all items from the store", () => {
    cartStore.addItem(item1);
    cartStore.addItem(item2);
    expect(cartStore.totalItems).toBe(2);
    cartStore.clear();
    expect(cartStore.totalItems).toBe(0);
  });

  it("method isPromoOK(promoName) should return false for non-existing promos", () => {
    expect(cartStore.isPromoOK("NOTEXISTS")).toBe(false);
  });

  it("method isPromoOK(promoName) should return true for one of the available promos", () => {
    expect(cartStore.isPromoOK("NEWYEAR")).toBe(true);
  });

  it("method addPromo(promoName) adds one of the available promos and provides correct discount", () => {
    cartStore.addItem(item1);
    expect(cartStore.finalPrice).toBe(item1.price);
    cartStore.addPromo("NEWYEAR"); // 10% discount
    expect(cartStore.finalPrice).toBe(Math.round(item1.price - item1.price / 100 * 10));
  });

  it("method addPromo(promoName) does not allow to apply same promo multiple times", () => {
    cartStore.addItem(item1);
    expect(cartStore.finalPrice).toBe(item1.price);
    cartStore.addPromo("NEWYEAR"); // 10% discount
    cartStore.addPromo("NEWYEAR");
    expect(cartStore.finalPrice).toBe(Math.round(item1.price - item1.price / 100 * 10));
  });

  it("method addPromo(promoName) should allow to apply several different promos for combined discount", () => {
    cartStore.addItem(item1);
    expect(cartStore.finalPrice).toBe(item1.price);
    cartStore.addPromo("NEWYEAR");  // 10% discount
    cartStore.addPromo("RSSCHOOL"); // 5% discount
    expect(cartStore.finalPrice).toBe(Math.round(item1.price - item1.price / 100 * 15));
  });

  it("method removePromo(promoName) should remove applied promo", () => {
    cartStore.addItem(item1);
    cartStore.addPromo("NEWYEAR");  // 10% discount
    expect(cartStore.finalPrice).toBe(Math.round(item1.price - item1.price / 100 * 10));
    cartStore.removePromo("NEWYEAR");
    expect(cartStore.finalPrice).toBe(item1.price);
  });

  it("method clear() should remove all applied promos", () => {
    cartStore.addItem(item1);
    expect(cartStore.finalPrice).toBe(item1.price);
    cartStore.addPromo("NEWYEAR");  // 10% discount
    cartStore.addPromo("RSSCHOOL"); // 5% discount
    expect(cartStore.finalPrice).toBe(Math.round(item1.price - item1.price / 100 * 15));
    cartStore.clear();
    cartStore.addItem(item1);
    expect(cartStore.finalPrice).toBe(item1.price);
  });
});
