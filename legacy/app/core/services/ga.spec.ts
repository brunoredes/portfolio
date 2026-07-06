import { TestBed } from '@angular/core/testing';

import { Ga } from './ga';

describe('Ga', () => {
  let service: Ga;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ga);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
