import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveTypeTableComponent } from './leave-type-table.component';

describe('LeaveTypeTableComponent', () => {
  let component: LeaveTypeTableComponent;
  let fixture: ComponentFixture<LeaveTypeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveTypeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveTypeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
