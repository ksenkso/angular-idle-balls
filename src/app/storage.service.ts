import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class StorageService<T> {
  protected constructor(protected key: string) {
    this.store = this.store.bind(this);
    this.load = this.load.bind(this);
    this.bindStore();
    const data = this.load();
    this.init(data);
  }

  protected abstract init(data: T): any;

  store(): T {
    return {} as T;
  }

  bindStore(): void {
    window.addEventListener('beforeunload', () => {
      // @ts-ignore
      if (!this.__proto__.constructor.shouldNotSave) {
        localStorage.setItem(this.key, JSON.stringify(this.store()));
      }
    });
  }

  load(): T | null {
    // @ts-ignore
    if (!this.__proto__.constructor.shouldNotLoad) {
      return JSON.parse(localStorage.getItem(this.key));
    }
  }
}
