import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusLayoutComponent } from './request-status-layout.component';

describe('RequestStatusLayoutComponent', () => {
  let component: RequestStatusLayoutComponent;
  let fixture: ComponentFixture<RequestStatusLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestStatusLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStatusLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
