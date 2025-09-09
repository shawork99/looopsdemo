import {Component, inject} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {FormErrorsPipe} from "@/app/shared/pipes/form-errors.pipe";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    ToggleSwitchComponentComponent
} from "@/app/shared/components/toggle-switch-component/toggle-switch-component.component";
import {TranslocoPipe} from "@jsverse/transloco";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {LeaveGroup} from "@store/leave_group/leave_group.model";
import {selectShowHideLeaveGroupForm, selectShowLeaveGroupFormLoading} from "@store/leave_group/leave_group.selector";
import {createLeaveGroup, showLeaveGroupFormLoading, updateLeaveGroup} from "@store/leave_group/leave_group.actions";

@Component({
    selector: 'app-leave-groups-form',
    imports: [
        AsyncPipe,
        FormErrorsPipe,
        NgIf,
        ReactiveFormsModule,
        ToggleSwitchComponentComponent,
        TranslocoPipe,
        NgClass
    ],
    templateUrl: './leave-groups-form.component.html',
    styleUrl: './leave-groups-form.component.scss'
})
export class LeaveGroupsFormComponent {
    public store = inject(Store);
    submitted = false;
    form: FormGroup = new FormGroup({
        code: new FormControl(null, Validators.required),
        name: new FormControl(null, Validators.required),
        is_active: new FormControl(true, Validators.required),
    });
    editLeaveGroup: LeaveGroup;
    private destroy$ = new Subject<void>();
    modalHeader: string;
    isLoading$ = this.store.select(selectShowLeaveGroupFormLoading)

    constructor(public modal: NgbActiveModal,
                private alertService: AlertService) {
        this.store.select(selectShowHideLeaveGroupForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            if (!show) {
                this.modal.close()
            }
        });
    }

    ngOnInit(): void {
        if (this.editLeaveGroup) {
            this.form.patchValue(this.editLeaveGroup);
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
        this.store.dispatch(showLeaveGroupFormLoading({show: true}));
        if (this.editLeaveGroup) {
            this.store.dispatch(updateLeaveGroup({LeaveGroupId: this.editLeaveGroup?.id, data: this.form.value}));
        } else {
            this.store.dispatch(createLeaveGroup({data: this.form.value}));
        }
    }
}