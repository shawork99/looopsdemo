import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalLevelFormComponent } from './approval-level-form.component';

describe('ApprovalLevelFormComponent', () => {
  let component: ApprovalLevelFormComponent;
  let fixture: ComponentFixture<ApprovalLevelFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalLevelFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalLevelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
