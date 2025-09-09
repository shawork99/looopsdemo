import {Component, inject} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    ToggleSwitchComponentComponent
} from "@/app/shared/components/toggle-switch-component/toggle-switch-component.component";
import {TranslocoModule} from "@jsverse/transloco";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {selectShowLeaveTypeFormLoading, selectShowHideLeaveTypeForm} from "@store/leave_type/leave_type.selector";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {createLeaveType, showLeaveTypeFormLoading, updateLeaveType} from "@store/leave_type/leave_type.actions";
import {LeaveType} from "@store/leave_type/leave_type.model";
import {FormErrorsPipe} from "@/app/shared/pipes/form-errors.pipe";

@Component({
    selector: 'app-leave-type-form',
    imports: [
        AsyncPipe,
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        NgClass,
        ToggleSwitchComponentComponent,
        TranslocoModule,
        FormErrorsPipe
    ],
    templateUrl: './leave-type-form.component.html',
    styleUrl: './leave-type-form.component.scss'
})
export class LeaveTypeFormComponent {


    public store = inject(Store);
    submitted = false;
    form: FormGroup = new FormGroup({
        code: new FormControl(null, Validators.required),
        name: new FormControl(null, Validators.required),
        is_active: new FormControl(true, Validators.required),
    });
    editLeaveType: LeaveType;
    private destroy$ = new Subject<void>();
    modalHeader: string;
    isLoading$ = this.store.select(selectShowLeaveTypeFormLoading)

    constructor(public modal: NgbActiveModal,
                private alertService: AlertService) {
        this.store.select(selectShowHideLeaveTypeForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            if (!show) {
                this.modal.close()
            }
        });
    }

    ngOnInit(): void {
        if (this.editLeaveType) {
            this.form.patchValue(this.editLeaveType);
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
        this.store.dispatch(showLeaveTypeFormLoading({show: true}));
        if (this.editLeaveType) {
            this.store.dispatch(updateLeaveType({LeaveTypeId: this.editLeaveType?.id, data: this.form.value}));
        } else {
            this.store.dispatch(createLeaveType({data: this.form.value}));
        }
    }
}
