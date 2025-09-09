import { Component, inject, OnDestroy } from '@angular/core';
import { AsyncPipe, NgClass, NgIf, NgFor } from "@angular/common";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators, FormBuilder, AbstractControl } from "@angular/forms";
import { Store } from "@ngrx/store";
import { filter, Subject, takeUntil } from "rxjs";
import {
  LeaveAdjustment,
  LeaveAdjustmentFormData,
  LeaveAdjustmentEmployeeRow,
  LeaveType,
  SaveLeaveAdjustmentDetailsPayload,
  DeleteLeaveAdjustmentDetail
} from "@store/leave_adjustment/leave_adjustment.model";
import {
  selectEditLeaveAdjustmentDetails,
  selectShowLeaveAdjustmentFormLoading,
  selectLeaveAdjustmentFormData,
  selectDetailsLeaveTypes,
  selectDetailsItems,
  selectDetailsLoading,
  selectDetailsSaving
} from "@store/leave_adjustment/leave_adjustment.selector";
import { AlertService } from "@/app/services/alert.service";
import {
  createLeaveAdjustment,
  getEditLeaveAdjustmentDetails,
  showLeaveAdjustmentFormLoading,
  updateLeaveAdjustment,
  getFormData,
  showHideLeaveAdjustmentDetailForm,
  loadLeaveAdjustmentDetails,
  saveLeaveAdjustmentDetails,
  deleteLeaveAdjustmentDetail,
  clearEditLeaveAdjustmentDetails,
  clearLeaveAdjustmentDetails
} from "@store/leave_adjustment/leave_adjustment.actions";
import { FormErrorsPipe } from "@/app/shared/pipes/form-errors.pipe";
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { LeaveAdjustmentEmployeeAssignComponent } from '../leave-adjustment-employee-assign/leave-adjustment-employee-assign.component';
import Swal from "sweetalert2";

type EmpRowForm = FormGroup<{
  employee_id: FormControl<number>;
  employee_name: FormControl<string>;
  remarks: FormControl<string | null>;
  balances: FormGroup;
  noOfDays: FormGroup;
  rowIds: FormGroup;
}>;


@Component({
  selector: 'app-leave-adjustment-edit-form',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    NgClass,
    NgIf,
    NgFor,
    FormErrorsPipe,
    BreadcrumbComponent
  ],
  templateUrl: './leave-adjustment-edit-form.component.html',
  styleUrl: './leave-adjustment-edit-form.component.scss'
})
export class LeaveAdjustmentEditFormComponent {
  public store = inject(Store);
  submitted = false;
  form: FormGroup;
  editLeaveAdjustmentID: number;
  editLeaveAdjustment: LeaveAdjustment = null;
  deleteLeaveAdjustmentID: number;
  deleteEmployeeID: number;
  private destroy$ = new Subject<void>();
  isLoading$ = this.store.select(selectShowLeaveAdjustmentFormLoading);
  formData: LeaveAdjustmentFormData = null;
  private modalService = inject(NgbModal);
  empForm!: FormGroup<{ rows: FormArray<EmpRowForm> }>;
  leaveTypes: LeaveType[] = null;
  loading$ = this.store.select(selectDetailsLoading);
  saving$ = this.store.select(selectDetailsSaving);
  detailsSaving$ = this.store.select(selectDetailsSaving);
  confirm: boolean = false;

  constructor(
    private alertService: AlertService,
    private route: ActivatedRoute,
    config: NgbModalConfig,
    private fb: FormBuilder
  ) {
    this.store.select(selectLeaveAdjustmentFormData).pipe(
      takeUntil(this.destroy$)
    ).subscribe(formData => {
      this.formData = formData;
    });
    this.route.paramMap.subscribe(params => {
      this.editLeaveAdjustmentID = + params.get('id');
    });
  }
  get rowsFA(): FormArray<EmpRowForm> {
    return this.empForm.get('rows') as FormArray<EmpRowForm>;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      id: new FormControl(null),
      adjustment_date: new FormControl({ value: null, disabled: true }),
      description: new FormControl(''),
      leave_group_id: new FormControl(null),
      policy_type: new FormControl({ value: null, disabled: true }),
      confirmed_yn: new FormControl(0),
    });

    this.empForm = this.fb.group({
      rows: this.fb.array<EmpRowForm>([])
    });

    this.store.dispatch(getFormData());

    this.route.paramMap.subscribe(params => {
      const newId = +params.get('id');
      this.store.dispatch(clearEditLeaveAdjustmentDetails());
      this.store.dispatch(clearLeaveAdjustmentDetails());

      this.editLeaveAdjustment = null;
      this.rowsFA.clear();
      this.editLeaveAdjustmentID = newId;
      if (this.editLeaveAdjustmentID) {
        this.store.dispatch(getEditLeaveAdjustmentDetails({ leaveAdjustmentID: this.editLeaveAdjustmentID }));
        this.store.dispatch(loadLeaveAdjustmentDetails({ leaveAdjustmentID: this.editLeaveAdjustmentID }));
      }
    });
    this.store.select(selectEditLeaveAdjustmentDetails)
      .pipe(takeUntil(this.destroy$))
      .subscribe((leaveAdjustment: LeaveAdjustment) => {
        this.editLeaveAdjustment = leaveAdjustment;
        if (this.editLeaveAdjustment) {
          this.initForm();
        }
      });

    this.store.select(selectDetailsLeaveTypes)
      .pipe(takeUntil(this.destroy$))
      .subscribe(leaveTypes => {
        this.leaveTypes = leaveTypes;
      });

    this.store.select(selectDetailsItems)
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.buildForm(items, this.leaveTypes);
        if (items && items.length > 0) {
          this.form.get('leave_group_id')?.disable({ emitEvent: false });
        } else {
          this.form.get('leave_group_id')?.enable({ emitEvent: false });
        }
      });
  }


  private initForm() {
    const today = new Date().toISOString().split('T')[0];
    this.confirm = this.editLeaveAdjustment.confirmed_yn === 1;

    if (this.editLeaveAdjustmentID) {
      this.form = new FormGroup({
        id: new FormControl(this.editLeaveAdjustment.id || null),
        adjustment_date: new FormControl({ value: this.editLeaveAdjustment.adjustment_date || today, disabled: true }, Validators.required),
        description: new FormControl({value: this.editLeaveAdjustment.description || null, disabled: this.confirm}, Validators.required),
        leave_group_id: new FormControl({value: this.editLeaveAdjustment.leave_group_id || null, disabled: this.confirm}, Validators.required),
        policy_type: new FormControl({ value: this.editLeaveAdjustment.policy_type || null, disabled: true }, Validators.required),
        confirmed_yn: new FormControl(this.editLeaveAdjustment.confirmed_yn || 0)
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
    this.store.dispatch(showLeaveAdjustmentFormLoading({ show: true }));
    const payload = this.form.getRawValue();
    if (this.editLeaveAdjustment) {
      this.store.dispatch(updateLeaveAdjustment({ leaveAdjustmentID: this.editLeaveAdjustmentID, data: payload }));
    } else {
      this.store.dispatch(createLeaveAdjustment({ data: payload }));
    }
  }
  assignEmployees() {
    const modalRef = this.modalService.open(LeaveAdjustmentEmployeeAssignComponent, { size: 'md', backdrop: 'static' });
    this.store.dispatch(showHideLeaveAdjustmentDetailForm({ show: true }));
    modalRef.componentInstance.modalHeader = 'Assign Employees';
    modalRef.componentInstance.leaveAdjustmentID = this.editLeaveAdjustment.id;
    modalRef.componentInstance.leaveGroupID = this.editLeaveAdjustment.leave_group_id;
    modalRef.result.then((result) => {
      if (result === 'success') {
        this.store.dispatch(loadLeaveAdjustmentDetails({
          leaveAdjustmentID: this.editLeaveAdjustmentID
        }));
      }
    }).catch(() => {

    });

  }
  private buildForm(items: LeaveAdjustmentEmployeeRow[], leaveTypes: LeaveType[]) {
    const byEmp = new Map<number, LeaveAdjustmentEmployeeRow[]>();
    for (const it of items) {
      if (!byEmp.has(it.employee_id)) byEmp.set(it.employee_id, []);
      byEmp.get(it.employee_id)!.push(it);
    }

    const rows: EmpRowForm[] = [];
    byEmp.forEach((empRows, employee_id) => {
      const name = `${empRows[0].employee.first_name} ${empRows[0].employee.last_name}`;
      const remarks = empRows.find(r => r.remarks != null)?.remarks ?? null;

      const balancesFG = this.fb.group({});
      const rowIdsFG = this.fb.group({});
      const noOfDays = this.fb.group({});

      for (const lt of leaveTypes) {
        const match = empRows.find(r => r.leave_type_id === lt.id);
        if (match) {
          let balance = match.new_balance ?? null;
          let no_of_days = lt.no_of_days ?? 0;

          if (balance !== null) {
            // normalize number: 14.00 -> 14, 13.50 -> 13.5
            balance = Number(balance);
            if (balance % 1 === 0) {
              balance = parseInt(balance.toString(), 10);
            } else {
              balance = parseFloat(balance.toFixed(1));
            }
          }

          balancesFG.addControl(
            String(lt.id),
            new FormControl<number | null>({value: balance, disabled: this.confirm})
          );
          noOfDays.addControl(
            String(lt.id),
            new FormControl<number | null>(no_of_days)
          );
          rowIdsFG.addControl(String(lt.id), new FormControl<number | null>(match.id ?? null));
        }
      }


      const rowFG = this.fb.group({
        employee_id: new FormControl<number>(employee_id, { nonNullable: true }),
        employee_name: new FormControl<string>(name, { nonNullable: true }),
        remarks: new FormControl<string | null>({value: remarks, disabled: this.confirm}),
        balances: balancesFG,
        noOfDays: noOfDays,
        rowIds: rowIdsFG
      }) as EmpRowForm;

      rows.push(rowFG);
    });
    this.rowsFA.clear();
    rows.forEach(r => this.rowsFA.push(r));
  }

  getBalanceKeys(row: AbstractControl): string[] {
    const balances = (row.get('balances') as FormGroup);
    return Object.keys(balances.controls);
  }

  formatValue(control: AbstractControl | null) {
    if (!control) return;
    let value = parseFloat(control.value);

    if (isNaN(value)) {
      control.setValue(null);
      return;
    }

    // Snap to nearest .5
    if (value % 0.5 !== 0) {
      value = Math.round(value * 2) / 2;
    }

    // Remove .00 if whole number
    if (value % 1 === 0) {
      control.setValue(value.toFixed(0), { emitEvent: false });
    } else {
      control.setValue(value.toFixed(1), { emitEvent: false });
    }
  }
  save(): void {
    if (this.empForm.invalid) {
      this.empForm.markAllAsTouched();
      return;
    }

    const rows = this.rowsFA.controls.map((row: FormGroup) => {
      const employee_id = row.get('employee_id')?.value;
      const remarks = row.get('remarks')?.value;
      const balances = (row.get('balances') as FormGroup).controls;
      const rowIds = (row.get('rowIds') as FormGroup).controls;

      return Object.keys(balances).map(leaveTypeId => {
        const adjusted_balance = balances[leaveTypeId]?.value ?? null;

        return {
          id: rowIds[leaveTypeId]?.value ?? null,
          employee_id,
          leave_type_id: Number(leaveTypeId),
          previous_balance: 0,
          adjusted_balance,
          new_balance: adjusted_balance,
          remarks
        };
      });
    }).flat();

    const payload: SaveLeaveAdjustmentDetailsPayload = {
      leave_adjustment_id: this.editLeaveAdjustmentID,
      rows
    };

    this.store.dispatch(saveLeaveAdjustmentDetails({ payload }));
  }
  saveAndconfirm() {
    this.form.patchValue({ confirmed_yn: 1 });
    this.onSubmit();
  }
  showDeleteAlert(control: AbstractControl) {
    this.deleteLeaveAdjustmentID = this.editLeaveAdjustmentID;
    this.deleteEmployeeID = control.value;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this record?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onDelete();
      } else {
        this.deleteLeaveAdjustmentID = undefined;
        this.deleteEmployeeID = undefined;
      }
    });
  }
  onDelete() {
    const payload: DeleteLeaveAdjustmentDetail = {
      leave_adjustment_id: this.deleteLeaveAdjustmentID,
      employee_id: this.deleteEmployeeID
    }
    this.store.dispatch(deleteLeaveAdjustmentDetail({ payload }));
  }
}
