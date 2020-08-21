import {TestBed} from '@angular/core/testing';
import {version} from '../../package.json';
import {StorageService} from './storage.service';
import {mockAddEventListener, mockLocalStorage} from '../../tests/mocks';

class ServiceUsingStorage extends StorageService<any> {
  protected init(data: any): any {
  }

  public constructor() {
    super('test');
  }

  store(): any {
    return {valid: true};
  }
}

describe('StorageService', () => {
  let service: ServiceUsingStorage;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    mockLocalStorage();
    mockAddEventListener();
    spyOn(ServiceUsingStorage.prototype, 'load').and.callThrough();
    service = new ServiceUsingStorage();
    spyOn(service, 'store').and.callThrough();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(ServiceUsingStorage.prototype.load).toHaveBeenCalledTimes(1);
  });

  it('should save to the storage on `beforeunload`', () => {
    window.dispatchEvent(new Event('beforeunload'));
    expect(service.store).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(`test/${version}`)).toEqual(JSON.stringify({valid: true}));
  });
});
