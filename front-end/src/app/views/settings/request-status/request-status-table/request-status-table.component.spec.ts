import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestStatusTableComponent} from "./request-status-table.component";

describe('RequestStatusTableComponent', () => {
  let component: RequestStatusTableComponent;
  let fixture: ComponentFixture<RequestStatusTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestStatusTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
