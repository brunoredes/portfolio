import { TestBed } from '@angular/core/testing';

import { StructuredData } from './structured-data';

describe('StructuredData', () => {
  let service: StructuredData;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StructuredData);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
