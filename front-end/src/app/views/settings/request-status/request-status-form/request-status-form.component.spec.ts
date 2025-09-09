import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RequestStatusFormComponent} from "./request-status-form.component";

describe('RequestStatusFormComponent', () => {
    let component: RequestStatusFormComponent;
    let fixture: ComponentFixture<RequestStatusFormComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RequestStatusFormComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RequestStatusFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
