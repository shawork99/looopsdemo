import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveGroupsTableComponent } from './leave-groups-table.component';

describe('LeaveGroupsTableComponent', () => {
  let component: LeaveGroupsTableComponent;
  let fixture: ComponentFixture<LeaveGroupsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveGroupsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveGroupsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
