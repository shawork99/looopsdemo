import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentProfile } from './component-profile';

describe('ComponentProfile', () => {
  let component: ComponentProfile;
  let fixture: ComponentFixture<ComponentProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
