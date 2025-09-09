import {Component, inject, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgFor, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    ToggleSwitchComponentComponent
} from "@/app/shared/components/toggle-switch-component/toggle-switch-component.component";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {RequestStatus} from "../../../../store/request-status/request-status.model";
import {
    selectRequestStatusFormLoading,
    selectShowHideRequestStatusForm
} from "../../../../store/request-status/request-status.selector";
import {
    createRequestStatus,
    showRequestStatusFormLoading,
    updateRequestStatus
} from "../../../../store/request-status/request-status.actions";
import {TranslocoModule} from "@jsverse/transloco";
import {FormErrorsPipe} from "../../../../shared/pipes/form-errors.pipe";


@Component({
    selector: 'app-request-status-form',
    imports: [
        AsyncPipe,
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        NgClass,
        ToggleSwitchComponentComponent,
        TranslocoModule,
        NgFor,
        FormErrorsPipe
    ],
    templateUrl: './request-status-form.component.html',
    styleUrl: './request-status-form.component.scss'
})
export class RequestStatusFormComponent implements OnInit {
    public store = inject(Store);
    submitted = false;
    @Input() requestTypeId!: number;
    basedTypeOptions: string[] = ['Open', 'Closed'];
    form: FormGroup = new FormGroup({
        code: new FormControl(null, Validators.required),
        name: new FormControl(null, Validators.required),
        sort_order: new FormControl(null, Validators.required),
        based_type: new FormControl(null),
        is_active: new FormControl(true, Validators.required),
        request_type_id: new FormControl(null, Validators.required),
        background_color: new FormControl('#938080', Validators.required)

    });
    editRequestStatus: RequestStatus;
    private destroy$ = new Subject<void>();
    modalHeader: string;
    isLoading$ = this.store.select(selectRequestStatusFormLoading)

    constructor(public modal: NgbActiveModal,
                private alertService: AlertService) {
        this.store.select(selectShowHideRequestStatusForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            if (!show) {
                this.modal.close()
            }
        });

    }

    ngOnInit(): void {
        if (this.requestTypeId) {
            this.form.patchValue({request_type_id: this.requestTypeId});
        }
        if (this.editRequestStatus) {
            this.form.patchValue(this.editRequestStatus);
        }
    }

    onStatusChange(event: any) {
        this.form.patchValue({is_active: event});

    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            this.alertService.showError("Please fill all the required fields");
            return;
        }
        this.store.dispatch(showRequestStatusFormLoading({show: true}));
        if (this.editRequestStatus) {
            this.store.dispatch(updateRequestStatus({
                requestStatusId: this.editRequestStatus?.id,
                data: this.form.value
            }));
        } else {
            this.store.dispatch(createRequestStatus({data: this.form.value}));
        }
    }
}
