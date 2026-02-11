import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessibilityModal } from './accessibility-modal';

describe('AccessibilityModal', () => {
  let component: AccessibilityModal;
  let fixture: ComponentFixture<AccessibilityModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessibilityModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessibilityModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
