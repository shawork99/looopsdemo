import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigationTableComponent } from './navigation-table.component';

describe('NavigationTableComponent', () => {
  let component: NavigationTableComponent;
  let fixture: ComponentFixture<NavigationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavigationTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavigationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
