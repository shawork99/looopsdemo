import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppovalsComponent } from './appovals.component';

describe('AppovalsComponent', () => {
  let component: AppovalsComponent;
  let fixture: ComponentFixture<AppovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppovalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
