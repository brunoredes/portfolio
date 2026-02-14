import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CookieModal } from './cookie-modal';

describe('CookieModal', () => {
  let component: CookieModal;
  let fixture: ComponentFixture<CookieModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CookieModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CookieModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
