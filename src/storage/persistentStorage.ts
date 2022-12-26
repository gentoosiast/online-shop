export class PersistentStorage {
  private uniquePrefix: string;
  private provider: Storage;

  constructor(uniquePrefix: string, provider: Storage = window.localStorage) {
    this.uniquePrefix = uniquePrefix;
    this.provider = provider;
  }

  private fullKey(key: string) {
    return `${this.uniquePrefix}-${key}`;
  }

  clear() {
    this.provider.clear();
  }

  get(key: string): unknown | null {
    const item = this.provider.getItem(this.fullKey(key));
    if (item === null) {
      return null;
    }

    return JSON.parse(item);
  }

  set(key: string, value: unknown) {
    this.provider.setItem(this.fullKey(key), JSON.stringify(value));
  }

  remove(key: string) {
    this.provider.removeItem(this.fullKey(key));
  }
}
