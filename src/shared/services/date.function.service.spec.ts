import { TestBed } from '@angular/core/testing';

import { Date.Function.ServiceService } from './date.function.service';

describe('Date.Function.ServiceService', () => {
  let service: Date.Function.ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Date.Function.ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
