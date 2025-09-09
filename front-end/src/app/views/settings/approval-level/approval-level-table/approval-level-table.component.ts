import { Component, inject } from '@angular/core';
import { ActiveStatusComponent } from "@/app/shared/components/active-status/active-status.component";
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";
import { NgForOf, NgIf } from "@angular/common";
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
import {isApprovalLevelGridLoading, selectApprovalLevelFormData, selectApprovalLevels} from "@store/approval-level/approval-level.selector";
import {
    deleteApprovalLevel,
    getAllApprovalLevels,
    getFormData,
    showHideApprovalLevelForm
} from "@store/approval-level/approval-level.actions";
import { ApprovalLevel, ApprovalLevelFilter, ApprovalLevelFormData, ApprovalLevelPaginate } from '@store/approval-level/approval-level.model';
import { ApprovalLevelFormComponent } from '../approval-level-form/approval-level-form.component';
import { YesNoStatusComponent } from '@/app/shared/components/yes-no-status/yes-no-status.component'

@Component({
  selector: 'app-approval-level-table',
  imports: [
    ActiveStatusComponent,
    YesNoStatusComponent,
    BreadcrumbComponent,
    NgForOf,
    NgIf,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './approval-level-table.component.html',
  styleUrl: './approval-level-table.component.scss'
})
export class ApprovalLevelTableComponent {
  private modalService = inject(NgbModal);
  filter: ApprovalLevelFilter = {
    search: null,
    perPage: 10,
    page: 1
  };
  approvelLevel: ApprovalLevelPaginate = null;
  private destroy$ = new Subject<void>();
  isLoading = false;
  deleteApprovalLevelId: number;
  formData: ApprovalLevelFormData = null;

  constructor(
    config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private store: Store
  ){
    this.store.select(selectApprovalLevels).pipe(
      takeUntil(this.destroy$)
    ).subscribe(approvalLevel => {
      this.approvelLevel = approvalLevel;
    });

    this.store.select(isApprovalLevelGridLoading).pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.isLoading = loading;
    });
    this.store.select(selectApprovalLevelFormData).pipe(
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
    this.getAllApprovalLevels();
  }

  onSearch() {
    this.getAllApprovalLevels();
  }

  showDeleteAlert(approvalLevelId: number) {
    this.deleteApprovalLevelId = approvalLevelId;
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
        this.deleteApprovalLevelId = undefined;
      }
    });
  }

  getAllApprovalLevels() {
    this.store.dispatch(getAllApprovalLevels({ data: this.filter }));
  }


  onRowsChange(event: any): void {
    this.filter.perPage = event.target.value;
    this.getAllApprovalLevels();
  }

  onPageChange(event: any) {
    this.filter.page = event;
    this.getAllApprovalLevels();
  }
  
  onDelete() {
    this.store.dispatch(deleteApprovalLevel({data: this.deleteApprovalLevelId}));
  }

  goToAdd() {
    const modalRef = this.modalService.open(ApprovalLevelFormComponent, {size: 'lg'});
    this.store.dispatch(showHideApprovalLevelForm({show: true}));
    modalRef.componentInstance.modalHeader = 'Add Approval Level';
    modalRef.componentInstance.formData = this.formData;
    modalRef.result.then((data) => {
      this.getAllApprovalLevels();
    });
  }

  goToEdit(approvalLevel: ApprovalLevel) {
    const modalRef = this.modalService.open(ApprovalLevelFormComponent, {size: 'lg'});
        this.store.dispatch(showHideApprovalLevelForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit Approval Level';
        modalRef.componentInstance.editApprovalLevelId = approvalLevel?.id;
        modalRef.componentInstance.formData = this.formData;
        modalRef.result.then((data) => {
            this.getAllApprovalLevels();
        });
  }

  isActive(status: string) {
    return status === 'active';
  }
}