import { TestBed } from '@angular/core/testing';

import { ContactHandler } from './contact-handler';

describe('ContactHandler', () => {
  let service: ContactHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
