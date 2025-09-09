import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalLevelTableComponent } from './approval-level-table.component';

describe('ApprovalLevelTableComponent', () => {
  let component: ApprovalLevelTableComponent;
  let fixture: ComponentFixture<ApprovalLevelTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovalLevelTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalLevelTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
