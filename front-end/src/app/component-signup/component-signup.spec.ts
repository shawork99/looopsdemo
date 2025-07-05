import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentSignup } from './component-signup';

describe('ComponentSignup', () => {
  let component: ComponentSignup;
  let fixture: ComponentFixture<ComponentSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentSignup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentSignup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
