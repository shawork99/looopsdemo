import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonViewComponent } from './common-view.component';

describe('CommonViewComponent', () => {
  let component: CommonViewComponent;
  let fixture: ComponentFixture<CommonViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
