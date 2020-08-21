import {TestBed} from '@angular/core/testing';

import {StorageService} from './storage.service';
class ServiceUsingStorage extends StorageService<any> {
  protected init(data: any): any {
  }
  public constructor() {
    super('test');
  }
}

describe('StorageService', () => {
  let service: ServiceUsingStorage;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    spyOn(ServiceUsingStorage.prototype, 'bindStore').and.callThrough();
    service = new ServiceUsingStorage();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call #bindStore when created', () => {
    expect(service.bindStore).toBeDefined();
    expect(ServiceUsingStorage.prototype.bindStore).toHaveBeenCalled();
  });
});
