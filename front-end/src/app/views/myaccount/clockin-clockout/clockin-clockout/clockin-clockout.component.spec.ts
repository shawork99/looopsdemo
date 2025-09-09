import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockinClockoutComponent } from './clockin-clockout.component';

describe('ClockinClockoutComponent', () => {
  let component: ClockinClockoutComponent;
  let fixture: ComponentFixture<ClockinClockoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClockinClockoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClockinClockoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
