import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentNavbar } from './component-navbar';

describe('ComponentNavbar', () => {
  let component: ComponentNavbar;
  let fixture: ComponentFixture<ComponentNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComponentNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
