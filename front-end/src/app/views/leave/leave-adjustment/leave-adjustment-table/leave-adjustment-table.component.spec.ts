import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveAdjustmentTableComponent } from './leave-adjustment-table.component';

describe('LeaveAdjustmentTableComponent', () => {
  let component: LeaveAdjustmentTableComponent;
  let fixture: ComponentFixture<LeaveAdjustmentTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveAdjustmentTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveAdjustmentTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
