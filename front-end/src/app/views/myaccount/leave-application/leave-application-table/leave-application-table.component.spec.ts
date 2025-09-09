import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicationTableComponent } from './leave-application-table.component';

describe('LeaveApplicationTableComponent', () => {
  let component: LeaveApplicationTableComponent;
  let fixture: ComponentFixture<LeaveApplicationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveApplicationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApplicationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
