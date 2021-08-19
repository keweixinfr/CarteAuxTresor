import { TestBed } from '@angular/core/testing';

import { AventureManagerService } from './aventure-manager.service';

describe('AventureManagerService', () => {
  let service: AventureManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AventureManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
