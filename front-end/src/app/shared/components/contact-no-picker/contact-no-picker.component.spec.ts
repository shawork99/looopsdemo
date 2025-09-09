import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactNoPickerComponent } from './contact-no-picker.component';

describe('ContactNoPickerComponent', () => {
  let component: ContactNoPickerComponent;
  let fixture: ComponentFixture<ContactNoPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactNoPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactNoPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
