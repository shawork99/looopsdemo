import { Component, inject, OnDestroy } from '@angular/core';
import { AsyncPipe, NgClass, NgIf, NgFor } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subject, takeUntil}  from "rxjs";
import { LeaveAdjustment, LeaveAdjustmentFormData } from "@store/leave_adjustment/leave_adjustment.model";
import { selectEditLeaveAdjustmentDetails, selectShowHideLeaveAdjustmentForm, selectShowLeaveAdjustmentFormLoading } from "@store/leave_adjustment/leave_adjustment.selector";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AlertService } from "@/app/services/alert.service";
import { createLeaveAdjustment, getEditLeaveAdjustmentDetails, showLeaveAdjustmentFormLoading, updateLeaveAdjustment } from "@store/leave_adjustment/leave_adjustment.actions";
import { FormErrorsPipe } from "@/app/shared/pipes/form-errors.pipe";

@Component({
  selector: 'app-leave-adjustment-form',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgFor,
    FormErrorsPipe
  ],
  templateUrl: './leave-adjustment-form.component.html',
  styleUrl: './leave-adjustment-form.component.scss'
})
export class LeaveAdjustmentFormComponent {
  public store = inject(Store);
  submitted = false;
  form: FormGroup;
  editLeaveAdjustmentID: number;
  editLeaveAdjustment: LeaveAdjustment;
  private destroy$ = new Subject<void>();
  modalHeader: string;
  isLoading$ = this.store.select(selectShowLeaveAdjustmentFormLoading);
  formData: LeaveAdjustmentFormData = null;
  

  constructor(
    public modal: NgbActiveModal,
    private alertService: AlertService
  ){
    this.store.select(selectShowHideLeaveAdjustmentForm).pipe(
      takeUntil(this.destroy$)
    ).subscribe((show) => {
      if (!show) {
        this.modal.close()
      }
    });
  }

  ngOnInit(): void {
    if (this.editLeaveAdjustmentID) {
      this.store.dispatch(getEditLeaveAdjustmentDetails({leaveAdjustmentID: this.editLeaveAdjustmentID}));
      this.store.select(selectEditLeaveAdjustmentDetails).pipe(
        takeUntil(this.destroy$)
      ).subscribe((leaveAdjustment: LeaveAdjustment) => {
        this.editLeaveAdjustment = leaveAdjustment;
        this.initForm();
      });
    } else {
       this.initForm();
    }
  }

  private initForm() {
    const today = new Date().toISOString().split('T')[0]; 

    if(this.editLeaveAdjustmentID){
      this.form = new FormGroup({
        id: new FormControl(this.editLeaveAdjustment.id || null),
        adjustment_date: new FormControl(this.editLeaveAdjustment.adjustment_date || today, Validators.required),
        description: new FormControl(this.editLeaveAdjustment.description || '', Validators.required),
        leave_group_id: new FormControl(this.editLeaveAdjustment.leave_group_id || null, Validators.required),
        policy_type: new FormControl({value: this.editLeaveAdjustment.policy_type || null, disabled: true}, Validators.required)
      });
    } else {
      this.form = new FormGroup({
        id: new FormControl(null),
        adjustment_date: new FormControl({ value: today, disabled: false }, Validators.required),
        description: new FormControl('', Validators.required),
        leave_group_id: new FormControl(null, Validators.required),
        policy_type: new FormControl({value: 'yearly', disabled: true}, Validators.required)
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit() {
    this.submitted = true;
    this.form.markAsTouched();
    if (this.form.invalid) {
      this.alertService.showError("Please fill all the required fields");
      return;
    }
    this.store.dispatch(showLeaveAdjustmentFormLoading({show: true}));
    const payload = this.form.getRawValue();
    if (this.editLeaveAdjustment) {
      this.store.dispatch(updateLeaveAdjustment({leaveAdjustmentID: this.editLeaveAdjustmentID, data: payload}));
    } else {
      this.store.dispatch(createLeaveAdjustment({data: payload}));
    }
  }
}
