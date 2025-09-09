import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeaveGroupDetailsFormComponent } from './leave-group-details-form.component';

describe('LeaveGroupDetailsFormComponent', () => {
  let component: LeaveGroupDetailsFormComponent;
  let fixture: ComponentFixture<LeaveGroupDetailsFormComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveGroupDetailsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveGroupDetailsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
