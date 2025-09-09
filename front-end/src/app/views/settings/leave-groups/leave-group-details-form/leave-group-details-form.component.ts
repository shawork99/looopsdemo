import {Component, inject} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormErrorsPipe} from "@/app/shared/pipes/form-errors.pipe";
import {FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TranslocoPipe} from "@jsverse/transloco";
import {Store} from "@ngrx/store";
import {LeaveGroupDetail, LeaveGroupDFormData} from "@store/leave_group/leave_group.model";
import {Subject, takeUntil} from "rxjs";
import {
    selectLeaveGroupDFormData, selectShowHideLeaveGroupDForm,
    selectShowLeaveGroupFormLoading
} from "@store/leave_group/leave_group.selector";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {
    createLeaveGroupDetail,
    getLeaveGroupDFormData,
    showLeaveGroupFormLoading
} from "@store/leave_group/leave_group.actions";
import {LeaveType} from "@store/leave_type/leave_type.model";

@Component({
    selector: 'app-leave-group-details-form',
    imports: [
        AsyncPipe,
        NgIf,
        ReactiveFormsModule,
        TranslocoPipe,
        NgForOf,
        FormsModule,
        FormErrorsPipe,
        NgClass
    ],
    templateUrl: './leave-group-details-form.component.html',
    styleUrl: './leave-group-details-form.component.scss'
})
export class LeaveGroupDetailsFormComponent {
    public store = inject(Store);
    submitted = false;
    form: FormGroup = new FormGroup({
        leaveGroupId: new FormControl(null, Validators.required),
        leaveGroupDetails: new FormArray([])
    });
    selectedLeaveTypeId: number;
    leaveGroupId: number;
    private destroy$ = new Subject<void>();
    modalHeader: string;
    isLoading$ = this.store.select(selectShowLeaveGroupFormLoading);
    formData: LeaveGroupDFormData;
    selectedLeaveTypes: LeaveType[] = [];
    yesNoList: any[] = [
        {
            value: 1,
            label: 'Yes'
        },
        {
            value: 0,
            label: 'No'
        }
    ];

    constructor(public modal: NgbActiveModal,
                private alertService: AlertService) {
        this.store.select(selectShowHideLeaveGroupDForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            if (!show) {
                this.modal.close()
            }
        });
        this.store.select(selectLeaveGroupDFormData).pipe(
            takeUntil(this.destroy$)
        ).subscribe((formData: LeaveGroupDFormData) => {
            this.formData = formData;
            if (this.formData?.leaveGroupDetails?.length > 0) {
                this.addEditLeaveGroupRow(this.formData?.leaveGroupDetails);
            }
        });
        const formArray = this.form.get('leaveGroupDetails') as FormArray;
        this.clearFormArray(formArray);
    }

    ngOnInit(): void {
        this.form.get('leaveGroupId')?.setValue(this.leaveGroupId);
        this.store.dispatch(getLeaveGroupDFormData({leaveGroupId: this.leaveGroupId}));
    }

    onLeaveTypeAdd() {
        if(!this.selectedLeaveTypeId){
            return this.alertService.showError('Please select leave type');
        }
        const isExist = this.selectedLeaveTypes?.find(s => s?.id == this.selectedLeaveTypeId);
        if (isExist) {
            return this.alertService.showError('Leave type already pulled to Grid');
        }
        const selected: any = this.formData?.leaveTypes.find(l => l?.id == this.selectedLeaveTypeId);
        if(selected){
            this.selectedLeaveTypes.push(selected);
            const formArray = this.form.get('leaveGroupDetails') as FormArray;
            formArray.push(this.addEmptyGroup(selected));
        }
    }

    private addEmptyGroup(leaveType: LeaveType): FormGroup {
        return new FormGroup({
            leaveTypeId: new FormControl(leaveType?.id, Validators.required),
            leaveTypeDetails: new FormControl(leaveType, Validators.required),
            policy: new FormControl(null, Validators.required),
            noOfDays: new FormControl(null, [
                Validators.required,
                Validators.min(1),
                Validators.max(100),
            ]),
            isCalendarDay: new FormControl(0),
            maximumApplicableDays: new FormControl(0, [
                Validators.min(0),
                Validators.max(100),
            ]),
            isAllowMinus: new FormControl(0),
            isCarryForward: new FormControl(0,
                [
                    Validators.min(0),
                    Validators.max(100),
                ]),
        });
    }

    private addEditLeaveGroupRow(leaveGroupDetails: LeaveGroupDetail[]): void {
        if (leaveGroupDetails?.length > 0) {
            const formArray = this.form.get('leaveGroupDetails') as FormArray;
            leaveGroupDetails?.forEach(detail => {
                this.selectedLeaveTypes.push(detail?.leave_type);
                const group = new FormGroup({
                    leaveTypeId: new FormControl(detail?.leave_type_id, Validators.required),
                    leaveTypeDetails: new FormControl(detail?.leave_type, Validators.required),
                    policy: new FormControl(detail?.policy, Validators.required),
                    noOfDays: new FormControl(detail?.no_of_days, [
                        Validators.required,
                        Validators.min(1),
                        Validators.max(100),
                    ]),
                    isCalendarDay: new FormControl(detail?.is_calendar_day),
                    maximumApplicableDays: new FormControl(detail?.maximum_applicable_days, [
                        Validators.min(0),
                        Validators.max(100),
                    ]),
                    isAllowMinus: new FormControl(detail?.is_allow_minus),
                    isCarryForward: new FormControl(detail?.is_carry_forward,
                        [
                            Validators.min(0),
                            Validators.max(100),
                        ]),
                });
                formArray.push(group);
            })
        }
    }

    details(): FormArray {
        return this.form.get('leaveGroupDetails') as FormArray;
    }

    onNumOfDaysChanged(group: any) {
        if (group.get('noOfDays').value) {
            group.get('maximumApplicableDays').setValidators([
                Validators.min(1),
                Validators.max(group.get('noOfDays').value),
            ]);
        } else {
            group.get('maximumApplicableDays').setValidators([
                Validators.min(0),
                Validators.max(0),
            ]);
        }
        group.get('maximumApplicableDays').updateValueAndValidity();
    }

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    removeItem(index: number, leaveTypeId: number) {
        const formArray = this.form.get('leaveGroupDetails') as FormArray;
        formArray.removeAt(index);
        this.selectedLeaveTypes = this.selectedLeaveTypes?.filter(s => s?.id !== leaveTypeId);
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            this.alertService.showError("Please fill all the required fields");
            return;
        }
        this.store.dispatch(showLeaveGroupFormLoading({show: true}));
        this.store.dispatch(createLeaveGroupDetail({data: this.form.value}));
    }
}