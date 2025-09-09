import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveApplicationFormComponent } from './leave-application-form.component';

describe('LeaveApplicationFormComponent', () => {
  let component: LeaveApplicationFormComponent;
  let fixture: ComponentFixture<LeaveApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveApplicationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
