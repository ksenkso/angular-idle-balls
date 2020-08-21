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
    service = new ServiceUsingStorage();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
