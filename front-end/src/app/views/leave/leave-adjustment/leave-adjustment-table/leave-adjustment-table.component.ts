import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";
import { NgForOf, NgIf , DatePipe, NgClass} from "@angular/common";
import {
    NgbModal,
    NgbModalConfig,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {TranslocoPipe} from "@jsverse/transloco";
import {Subject, takeUntil} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {Store} from "@ngrx/store";
import Swal from "sweetalert2";
import { isLeaveAdjustmentGridLoading, selectLeaveAdjustment, selectLeaveAdjustmentFormData} from "@store/leave_adjustment/leave_adjustment.selector";
import {
    deleteLeaveAdjustment,
    getAllLeaveAdjustment,
    showHideLeaveAdjustmentForm,
    getFormData
} from "@store/leave_adjustment/leave_adjustment.actions";
import { LeaveAdjustment, LeaveAdjustmentFilter, LeaveAdjustmentPaginate, LeaveAdjustmentFormData } from '@store/leave_adjustment/leave_adjustment.model';
import { LeaveAdjustmentFormComponent } from '../leave-adjustment-form/leave-adjustment-form.component';
import { Router } from '@angular/router';
import { StatusLabelPipe } from '../../../../pipes/status-label.pipe';

@Component({
  selector: 'app-leave-adjustment-table',
  imports: [
    BreadcrumbComponent,
    NgForOf,
    NgIf,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious,
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    NgClass,
    StatusLabelPipe
  ],
  templateUrl: './leave-adjustment-table.component.html',
  styleUrl: './leave-adjustment-table.component.scss'
})
export class LeaveAdjustmentTableComponent {
  private modalService = inject(NgbModal);
  filter: LeaveAdjustmentFilter = {
    search: null,
    perPage: 10,
    page: 1
  };
  leaveAdjustment: LeaveAdjustmentPaginate = null;
  private destroy$ = new Subject<void>();
  isLoading = false;
  deleteLeaveAdjustmentID: number;
  formData: LeaveAdjustmentFormData = null;

  constructor(
      config: NgbModalConfig,
      private spinner: NgxSpinnerService,
      private store: Store,
      private router: Router
  ){
    this.store.select(selectLeaveAdjustment).pipe(
      takeUntil(this.destroy$)
    ).subscribe(leaveAdjustment => {
      this.leaveAdjustment = leaveAdjustment;
    });
  
    this.store.select(isLeaveAdjustmentGridLoading).pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.isLoading = loading;
    });

    this.store.select(selectLeaveAdjustmentFormData).pipe(
      takeUntil(this.destroy$)
    ).subscribe(formData => {
      this.formData = formData;
    });

    config.backdrop = 'static';
    config.keyboard = false;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngOnInit() {
    this.store.dispatch(getFormData());
    this.getAllLeaveAdjustment();
  }

  onSearch() {
    this.getAllLeaveAdjustment();
  }
  getAllLeaveAdjustment() {
    this.store.dispatch(getAllLeaveAdjustment({ data: this.filter }));
  }
  onRowsChange(event: any): void {
    this.filter.perPage = event.target.value;
    this.getAllLeaveAdjustment();
  }
  onPageChange(event: any) {
    this.filter.page = event;
    this.getAllLeaveAdjustment();
  }
  goToAdd() {
    const modalRef = this.modalService.open(LeaveAdjustmentFormComponent, {size: 'lg'});
    this.store.dispatch(showHideLeaveAdjustmentForm({show: true}));
    modalRef.componentInstance.modalHeader = 'Add Leave Adjustment';
    modalRef.componentInstance.formData = this.formData;
    modalRef.result.then((data) => {
      this.getAllLeaveAdjustment();
    });
  }
  goToEdit(leaveAdjustmentID: number) {
    this.router.navigate(['/leave_adjustment/edit/' + leaveAdjustmentID]);
  }
  showDeleteAlert(approvalLevelId: number) {
    this.deleteLeaveAdjustmentID = approvalLevelId;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      confirmButtonColor: '#d33',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.onDelete();
      } else {
        this.deleteLeaveAdjustmentID = undefined;
      }
    });
  }
  onDelete() {
    this.store.dispatch(deleteLeaveAdjustment({data: this.deleteLeaveAdjustmentID}));
  }
}
