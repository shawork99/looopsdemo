import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAdjustmentFormComponent } from './leave-adjustment-form.component';

describe('LeaveAdjustmentFormComponent', () => {
  let component: LeaveAdjustmentFormComponent;
  let fixture: ComponentFixture<LeaveAdjustmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveAdjustmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveAdjustmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
