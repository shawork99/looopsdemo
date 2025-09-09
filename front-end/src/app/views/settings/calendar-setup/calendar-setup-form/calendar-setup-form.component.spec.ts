import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSetupFormComponent } from './calendar-setup-form.component';

describe('CalendarSetupFormComponent', () => {
  let component: CalendarSetupFormComponent;
  let fixture: ComponentFixture<CalendarSetupFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSetupFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSetupFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
