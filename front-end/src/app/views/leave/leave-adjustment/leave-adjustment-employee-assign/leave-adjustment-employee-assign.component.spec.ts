import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAdjustmentEmployeeAssignComponent } from './leave-adjustment-employee-assign.component';

describe('LeaveAdjustmentEmployeeAssignComponent', () => {
  let component: LeaveAdjustmentEmployeeAssignComponent;
  let fixture: ComponentFixture<LeaveAdjustmentEmployeeAssignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveAdjustmentEmployeeAssignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveAdjustmentEmployeeAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
