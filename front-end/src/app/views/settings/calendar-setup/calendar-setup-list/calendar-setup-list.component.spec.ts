import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSetupListComponent } from './calendar-setup-list.component';

describe('CalendarSetupListComponent', () => {
  let component: CalendarSetupListComponent;
  let fixture: ComponentFixture<CalendarSetupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarSetupListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarSetupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
