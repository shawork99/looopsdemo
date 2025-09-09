import { Component, inject, OnDestroy } from '@angular/core';
import { AsyncPipe, NgClass, NgIf, NgFor } from "@angular/common";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subject, takeUntil}  from "rxjs";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AlertService } from "@/app/services/alert.service";
import { FormErrorsPipe } from "@/app/shared/pipes/form-errors.pipe";
import { LeaveAdjustmentDetailFormData } from '@store/leave_adjustment/leave_adjustment.model';
import { LeaveAdjustmentState } from '@store/leave_adjustment/leave_adjustment.reducer';
import * as LeaveAdjustmentAction from '@store/leave_adjustment/leave_adjustment.actions';
import { selectLeaveAdjustmentDetailFormData, selectShowLeaveAdjustmentDetailFormLoading, selectShowHideLeaveAdjustmentDetailForm } from '@store/leave_adjustment/leave_adjustment.selector';
import { NgSelectModule } from '@ng-select/ng-select';


@Component({
  selector: 'app-leave-adjustment-employee-assign',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgFor,
    FormErrorsPipe,
    NgSelectModule
  ],
  templateUrl: './leave-adjustment-employee-assign.component.html',
  styleUrl: './leave-adjustment-employee-assign.component.scss'
})
export class LeaveAdjustmentEmployeeAssignComponent {
  public store = inject(Store);
  private destroy$ = new Subject<void>();
  modalHeader: string;
  leaveAdjustmentID: number;
  leaveGroupID: number;
  form: FormGroup;
  detailFormData: LeaveAdjustmentDetailFormData;
  submitted = false;
  isDetailLoading$ = this.store.select(selectShowLeaveAdjustmentDetailFormLoading);

  constructor(
    public modal: NgbActiveModal,
    private alertService: AlertService
  ) {
    this.store.select(selectShowHideLeaveAdjustmentDetailForm).pipe(
      takeUntil(this.destroy$)
    ).subscribe((show) => {
      if (!show) {
        this.modal.close('success')
      }
    });
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      employees: new FormControl([], Validators.required),
      leave_types: new FormControl([], Validators.required),
    });

    this.store.dispatch(LeaveAdjustmentAction.getDetailFormData({leaveGroupID: this.leaveGroupID}));
    this.store.select(selectLeaveAdjustmentDetailFormData).pipe(
      takeUntil(this.destroy$)
    ).subscribe((detailFormData: LeaveAdjustmentDetailFormData) => {
      if(detailFormData){
        this.detailFormData = detailFormData;
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onSubmit(){
    this.submitted = true;
    this.form.markAsTouched();
    if (this.form.invalid) {
      this.alertService.showError("Please fill all the required fields");
      return;
    }
    this.store.dispatch(LeaveAdjustmentAction.showLeaveAdjustmentDetailFormLoading({show: true}));
    let payload = this.form.getRawValue();
    payload.leave_adjustment_id = this.leaveAdjustmentID;
    payload.leave_group_id = this.leaveGroupID;
    this.store.dispatch(LeaveAdjustmentAction.createLeaveAdjustmentDetail({data: payload}));
  }
}
