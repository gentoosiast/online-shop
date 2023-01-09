import { PersistentStorage } from '../storage/persistentStorage';

let testStorage: PersistentStorage;

beforeEach(() => {
  testStorage = new PersistentStorage("uniqueprefix");
});

describe('PersistentStorage', () => {
  it("should create new instance of PersistentStorage class", () => {
    expect(testStorage).toBeInstanceOf(PersistentStorage);
  });

  it("get() method should return null for non-existent keys", () => {
    expect(testStorage.get('missing-key')).toBe(null);
  });

  it("set() method works correctly for primitive values", () => {
    testStorage.set('primitive-value', 42);
    expect(testStorage.get('primitive-value')).toBe(42);
  });

  it("set() method works correctly for non-primitives", () => {
    const myTestObj = {
      foo: 42
    };

    testStorage.set('non-primitive', myTestObj);
    expect(testStorage.get('non-primitive')).not.toBe(myTestObj);
    expect(testStorage.get('non-primitive')).toEqual(myTestObj);
  });

  it("remove() method works correctly", () => {
    testStorage.set('primitive-value', 42);
    testStorage.remove('primitive-value');
    expect(testStorage.get('primitive-value')).toBe(null);
  });

  it("clear() method works correctly", () => {
    testStorage.set('primitive-value1', 42);
    testStorage.set('primitive-value2', "foo");
    testStorage.clear();
    expect(testStorage.get('primitive-value1')).toBe(null);
    expect(testStorage.get('primitive-value2')).toBe(null);
  });
});
