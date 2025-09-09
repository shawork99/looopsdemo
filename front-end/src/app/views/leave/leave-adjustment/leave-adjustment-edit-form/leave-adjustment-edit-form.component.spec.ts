import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAdjustmentEditFormComponent } from './leave-adjustment-edit-form.component';

describe('LeaveAdjustmentEditFormComponent', () => {
  let component: LeaveAdjustmentEditFormComponent;
  let fixture: ComponentFixture<LeaveAdjustmentEditFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveAdjustmentEditFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveAdjustmentEditFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
