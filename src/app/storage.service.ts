import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class StorageService<T> {
  protected key: string;

  protected constructor(key: string) {
    this.key = `${key}/${environment.version}`;
    this.store = this.store.bind(this);
    this.load = this.load.bind(this);
    this.bindStore();
    const data = this.load();
    this.init(data);
  }

  protected abstract init(data: T): any;

  public abstract store(): T;

  protected bindStore(): void {
    window.addEventListener('beforeunload', () => {
      // @ts-ignore
      if (!this.__proto__.constructor.shouldNotSave) {
        this.saveToStorage();
      }
    });
  }

  protected saveToStorage(): void {
    localStorage.setItem(this.key, JSON.stringify(this.store()));
  }

  load(): T | null {
    // @ts-ignore
    if (!this.__proto__.constructor.shouldNotLoad) {
      const data = localStorage.getItem(this.key);
      if (data) {
        return JSON.parse(data);
      } else {
        return null;
      }
    }
  }
}
