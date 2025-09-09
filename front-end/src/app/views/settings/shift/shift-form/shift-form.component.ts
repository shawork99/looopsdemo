import {Component, inject} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf} from "@angular/common";
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    ToggleSwitchComponentComponent
} from "@/app/shared/components/toggle-switch-component/toggle-switch-component.component";
import {TranslocoPipe} from "@jsverse/transloco";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {Subject, takeUntil} from "rxjs";
import {Store} from "@ngrx/store";
import {selectEditShift, selectShowHideShiftForm, selectShowShiftFormLoading} from "@store/shift/shift.selector";
import {Shift} from "@store/shift/shift.model";
import {createShift, onGetEditShift, showShiftFormLoading, updateShift} from "@store/shift/shift.actions";
import {FormErrorsPipe} from "@/app/shared/pipes/form-errors.pipe";

@Component({
    selector: 'app-shift-form',
    imports: [
        AsyncPipe,
        NgIf,
        ReactiveFormsModule,
        ToggleSwitchComponentComponent,
        TranslocoPipe,
        NgClass,
        NgForOf,
        FormErrorsPipe
    ],
    templateUrl: './shift-form.component.html',
    styleUrl: './shift-form.component.scss'
})
export class ShiftFormComponent {
    public store = inject(Store);
    modalHeader: string;
    private destroy$ = new Subject<void>();
    form: FormGroup = new FormGroup({
        code: new FormControl(null, Validators.required),
        name: new FormControl(null, Validators.required),
        is_active: new FormControl(true, Validators.required),
        shiftDetails: new FormArray([])
    });
    submitted = false;
    editShiftId: number;
    editShift: Shift;
    isLoading$ = this.store.select(selectShowShiftFormLoading);

    constructor(public modal: NgbActiveModal,
                private alertService: AlertService) {
        this.store.select(selectShowHideShiftForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            if (!show) {
                this.modal.close()
            }
        });
        this.store.select(selectEditShift).pipe(
            takeUntil(this.destroy$)
        ).subscribe((editShift: Shift) => {
            if(this.editShiftId){
                this.editShift = editShift;
                this.initShiftDetailsForEdit();
            }
        });
    }

    ngOnInit(): void {
        const formArray = this.form.get('shiftDetails') as FormArray;
        this.clearFormArray(formArray);
        if (!this.editShiftId) {
            this.initShiftDetails();
        } else {
            this.store.dispatch(onGetEditShift({shiftId: this.editShiftId}));
        }
    }

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    initShiftDetails() {
        const shiftDetails = this.form.get('shiftDetails') as FormArray;
        const days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        days?.forEach(day => {
            const control = new FormGroup({
                day_name: new FormControl(day, Validators.required),
                start_time: new FormControl(null, Validators.required),
                end_time: new FormControl(null, Validators.required),
                grace_time: new FormControl(null),
                work_hours: new FormControl(null),
                work_hours_minute: new FormControl(null),
                is_week_day: new FormControl(true),
            });
            shiftDetails.push(control);
        });
    }

    initShiftDetailsForEdit() {
        this.form.patchValue({
            code: this.editShift?.code,
            name: this.editShift?.name,
            is_active: this.editShift?.is_active,
            shiftDetails: []
        });
        const shiftDetails = this.form.get('shiftDetails') as FormArray;
        const shiftD = this.editShift?.shift_details;
        shiftD?.forEach(detail => {
            const control = new FormGroup({
                day_name: new FormControl(detail?.day_name, Validators.required),
                start_time: new FormControl(detail?.start_time, Validators.required),
                end_time: new FormControl(detail?.end_time, Validators.required),
                grace_time: new FormControl(detail?.grace_time),
                work_hours: new FormControl(detail?.work_hours),
                work_hours_minute: new FormControl(detail?.work_hours_minute),
                is_week_day: new FormControl(detail?.is_week_day),
            });
            if (detail?.is_week_day) {
                control.get('start_time').setValidators([
                    Validators.required
                ]);
                control.get('end_time').setValidators([
                    Validators.required
                ]);
            } else {
                control.get('start_time').setValidators([]);
                control.get('end_time').setValidators([]);
            }
            control.get('start_time').updateValueAndValidity();
            control.get('end_time').updateValueAndValidity();
            control.updateValueAndValidity();
            shiftDetails.push(control);
        });
    }

    shiftDetails(): FormArray {
        return this.form.get('shiftDetails') as FormArray;
    }

    onStatusChange(event: any) {
        this.form.patchValue({is_active: event});
    }

    onWeekChecked(event: any, group: any) {
        group.get('is_week_day').setValue(event);
        group.get('start_time').setValue(null);
        if (event) {
            group.get('start_time').setValue(null);
            group.get('start_time').setValidators([
                Validators.required
            ]);
            group.get('end_time').setValue(null);
            group.get('end_time').setValidators([
                Validators.required
            ]);
        } else {
            group.get('start_time').setValidators([]);
            group.get('end_time').setValue(null);
            group.get('end_time').setValidators([]);
        }
        group.get('start_time').updateValueAndValidity();
        group.get('end_time').updateValueAndValidity();
        group.get('work_hours').setValue(event);
        group.updateValueAndValidity();
    }

    updateWorkedHours(control: any): any {
        const startTime = control.get('start_time')?.value;
        const endTime = control.get('end_time')?.value;
        if (!startTime || !endTime) {
            control.get('work_hours')?.setValue(null);
            return null;
        }
        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);
        const startTotalMinutes = startHour * 60 + startMinute;
        const endTotalMinutes = endHour * 60 + endMinute;
        if (endTotalMinutes < startTotalMinutes) {
            return null;
        }
        let totMinutes = endTotalMinutes - startTotalMinutes;
        const hours = Math.floor(totMinutes / 60);
        const minutes = totMinutes - hours * 60;
        let la = '';
        if (hours) {
            la = `${hours}h`;
        }
        if (minutes > 0) {
            la = la + ` ${minutes}m`;
        }
        control.get('work_hours')?.setValue(la);
        control.get('work_hours_minute')?.setValue(totMinutes);
        control.updateValueAndValidity();
    }

    onSubmit() {
        const value = this.form.value;
        this.submitted = true;
        let valid = true;
        if (value?.shiftDetails?.length === 0) {
            this.alertService.showError('Shift details not found');
        }
        value?.shiftDetails?.forEach((val: any) => {
            if (val?.start_time && val?.end_time) {
                const [startHour, startMinute] = val?.start_time?.split(':');
                const [endHour, endMinute] = val?.end_time?.split(':');
                const startTotalMinutes = Number(startHour * 60 + startMinute);
                const endTotalMinutes = Number(endHour * 60 + endMinute);
                if (endTotalMinutes < startTotalMinutes) {
                    valid = false;
                }
            }
        });

        if (!valid) {
            this.alertService.showError('Shift details is invalid');
            return;
        }
        if (this.form.invalid) {
            this.alertService.showError("Please fill all the required fields");
            return;
        }
        this.store.dispatch(showShiftFormLoading({show: true}));
        if (this.editShift) {
            this.store.dispatch(updateShift({shiftId: this.editShift?.id, data: this.form.value}));
        } else {
            this.store.dispatch(createShift({data: this.form.value}));
        }
    }
}