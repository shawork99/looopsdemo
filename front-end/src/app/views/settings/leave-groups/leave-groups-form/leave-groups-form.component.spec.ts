import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveGroupsFormComponent } from './leave-groups-form.component';

describe('LeaveGroupsFormComponent', () => {
  let component: LeaveGroupsFormComponent;
  let fixture: ComponentFixture<LeaveGroupsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveGroupsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveGroupsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
