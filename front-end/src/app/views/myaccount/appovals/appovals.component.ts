import { Component, inject } from '@angular/core';
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";
import { NgForOf, NgIf } from "@angular/common";
import {
    NgbModal,
    NgbModalConfig,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import {Subject, takeUntil} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {Store} from "@ngrx/store";
import Swal from "sweetalert2";
import {isApprovalsGridLoading, selectApprovals} from "@store/approvals/approvals.selector";
import {
    getAllApprovals,
    approveDocument
} from "@store/approvals/approvals.actions";
import { Approvals, ApprovalsFilter, ApprovalsPaginate } from '@store/approvals/approvals.model';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";


@Component({
  selector: 'app-appovals',
  imports: [
    BreadcrumbComponent,
    NgForOf,
    NgIf,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './appovals.component.html',
  styleUrl: './appovals.component.scss'
})
export class AppovalsComponent {
  private modalService = inject(NgbModal);
  filter: ApprovalsFilter = {
    search: null,
    perPage: 10,
    page: 1
  };
  approvels: ApprovalsPaginate = null;
  private destroy$ = new Subject<void>();
  isLoading = false;
  approveDocumentItem: Approvals = null;

  constructor(
    config: NgbModalConfig,
    private spinner: NgxSpinnerService,
    private store: Store
  ){
    this.store.select(selectApprovals).pipe(
      takeUntil(this.destroy$)
    ).subscribe(approvals => {
      this.approvels = approvals;
    });
    
    this.store.select(isApprovalsGridLoading).pipe(
      takeUntil(this.destroy$)
    ).subscribe(loading => {
      this.isLoading = loading;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  ngOnInit() {
    this.getAllApprovals();
  }
  
  onSearch() {
    this.getAllApprovals();
  }

  onRowsChange(event: any): void {
    this.filter.perPage = event.target.value;
    this.getAllApprovals();
  }
  onPageChange(event: any) {
    this.filter.page = event;
    this.getAllApprovals();
  }
  
  getAllApprovals() {
    this.store.dispatch(getAllApprovals({ data: this.filter }));
  }
  approveDocument(approveDocument: Approvals) {
    this.approveDocumentItem = { ...approveDocument }; // clone so we don't mutate directly

    Swal.fire({
      title: 'Approve!',
      input: 'textarea',
      inputPlaceholder: 'Enter your comment...',
      inputAttributes: {
        'aria-label': 'Enter your comment'
      },
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
      icon: 'info',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      preConfirm: (remark) => {
        if (!remark) {
          Swal.showValidationMessage('Comment are required!');
        }
        return remark;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.approveDocumentItem = {
          ...this.approveDocumentItem,
          comment: result.value
        };
        this.onApproveDocument();
      } else {
        this.approveDocumentItem = null;
      }
    });
  }

  onApproveDocument() {
    this.store.dispatch(approveDocument({ data: this.approveDocumentItem }));
  }


}
