import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    ToggleSwitchComponentComponent
} from "@/app/shared/components/toggle-switch-component/toggle-switch-component.component";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {ApprovalLevel, ApprovalLevelFormData} from "@store/approval-level/approval-level.model";
import {selectEditApprovalLevelDetails, selectShowHideApprovalLevelForm, selectShowApprovalLevelFormLoading, selectApproverRoleID} from "@store/approval-level/approval-level.selector";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {createApprovalLevel, getEditApprovalLevelDetails, showApprovalLevelFormLoading, updateApprovalLevel, getApproverRoleID} from "@store/approval-level/approval-level.actions";
import {FormErrorsPipe} from "@/app/shared/pipes/form-errors.pipe";

@Component({
  selector: 'app-approval-level-form',
  imports: [
    AsyncPipe,
    NgIf,
    ReactiveFormsModule,
    ToggleSwitchComponentComponent,
    NgForOf,
    NgClass,
    NgTemplateOutlet,
    FormErrorsPipe
  ],
  templateUrl: './approval-level-form.component.html',
  styleUrl: './approval-level-form.component.scss'
})
export class ApprovalLevelFormComponent {
  public store = inject(Store);
  submitted = false;
  form: FormGroup;
  editApprovalLevelId: number;
  editApprovalLevel: ApprovalLevel;
  private destroy$ = new Subject<void>();
  modalHeader: string;
  isLoading$ = this.store.select(selectShowApprovalLevelFormLoading);
  formData: ApprovalLevelFormData = null;

  constructor(
    public modal: NgbActiveModal,
    private alertService: AlertService
  ){
    this.store.select(selectShowHideApprovalLevelForm).pipe(
      takeUntil(this.destroy$)
    ).subscribe((show) => {
      if (!show) {
        this.modal.close()
      }
    });
  }

  ngOnInit(): void {
    if (this.editApprovalLevelId) {
      this.store.dispatch(getEditApprovalLevelDetails({approvalLevelId: this.editApprovalLevelId}));
      this.store.select(selectEditApprovalLevelDetails).pipe(
        takeUntil(this.destroy$)
      ).subscribe((approvalLevel: ApprovalLevel) => {
        this.editApprovalLevel = approvalLevel;
        this.initForm();
      });
    } else {
      this.initForm();
    }
    this.store.select(selectApproverRoleID).pipe(
      takeUntil(this.destroy$)
    ).subscribe((roleId) => {
      if (roleId && this.form) {
        this.form.patchValue({ approver_role_id: roleId });
      }
    });
  }

  private initForm() {
    if(this.editApprovalLevelId){
      this.form = new FormGroup({
        level: new FormControl(this.editApprovalLevel?.level || null, [
          Validators.required,
          Validators.min(1),
          Validators.max(3)
        ]),
        approver_id: new FormControl(this.editApprovalLevel?.approver_id || null, [
          Validators.required
        ]),
        approver_role_id: new FormControl(
          { value: this.editApprovalLevel?.approver_role_id || null, disabled: true }, [
          Validators.required
        ]),
        document_system_id: new FormControl(this.editApprovalLevel?.document_system_id || null, [
          Validators.required
        ]),
        is_mandatory: new FormControl(this.editApprovalLevel?.is_mandatory || false),
        status: new FormControl(this.editApprovalLevel?.status || 'active')
      });
    } else {
      this.form = new FormGroup({
        level: new FormControl(null, [
          Validators.required,
          Validators.min(1),
          Validators.max(3)
        ]),
        approver_id: new FormControl(null, [
          Validators.required
        ]),
        approver_role_id: new FormControl({ value: null, disabled: true }, [
          Validators.required
        ]),
        document_system_id: new FormControl(null, [
          Validators.required
        ]),
        is_mandatory: new FormControl(false),
        status: new FormControl('active')
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStatusChange(value: any) {
    this.form.patchValue({ status: value ? 'active' : 'inactive' });
  }

  onMandatoryChange(event: any) {
    this.form.patchValue({is_mandatory: event});
  }

  
  onSubmit() {
    this.submitted = true;
    this.form.markAsTouched();
    if (this.form.invalid) {
      this.alertService.showError("Please fill all the required fields");
      return;
    }
    this.store.dispatch(showApprovalLevelFormLoading({show: true}));
    const payload = this.form.getRawValue();
    if (this.editApprovalLevel) {
      this.store.dispatch(updateApprovalLevel({approvalLevelId: this.editApprovalLevel?.id, data: payload}));
    } else {
      this.store.dispatch(createApprovalLevel({data: payload}));
    }
  }
  onApproverChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    if (selectedId) {
      this.store.dispatch(getApproverRoleID({ roleId: +selectedId }));
    }
  }
}
