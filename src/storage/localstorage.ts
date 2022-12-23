class StorageService {
  ls: Storage;
  settings: any;
  prefix: string;
  constructor(prefix: string) {
      this.ls = window.localStorage;
      this.prefix = prefix;
  }

  private prefixKey(plainKey: string): string {
    if (this.prefix) {
      return `[${this.prefix}]${plainKey}`;
    }
    return plainKey;
  }

  setItem(key: string, value: string) {
      this.ls.setItem(this.prefixKey(key), JSON.stringify(value));
  }

  getItem(key: string) {
    const data: string | null = this.ls.getItem(this.prefixKey(key));
    if (data !== null) {
      return JSON.parse(data).value;
    }
    return null;
  }

  getLength(): number {
      return this.ls.length;
  }

  removeItem(key: string):void {
      this.ls.removeItem(this.prefixKey(key));
  }

  clear():void {
      this.ls.clear();
  }

  // key(index: number):string {
  //     return this.ls.key(index);
  // }
}


const ls = new StorageService('gentoosiast_sinastya_shop');
