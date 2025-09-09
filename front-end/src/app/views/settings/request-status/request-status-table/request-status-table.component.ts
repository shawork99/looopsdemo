import {Component, inject, Input} from '@angular/core';
import {ActiveStatusComponent} from "@/app/shared/components/active-status/active-status.component";
import {BreadcrumbComponent} from "@components/breadcrumb/breadcrumb.component";
import {FormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
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
import {RequestStatus, RequestStatusFilter, RequestStatusPaginate} from "@store/request-status/request-status.model";
import {isRequestStatusGridLoading, selectRequestStatus} from "@store/request-status/request-status.selector";
import {
    deleteRequestStatus,
    getAllRequestStatus,
    showHideRequestStatusForm
} from "@store/request-status/request-status.actions";
import {RequestStatusFormComponent} from "@views/settings/request-status/request-status-form/request-status-form.component";
import {TranslocoModule, TranslocoPipe} from "@jsverse/transloco";

@Component({
    selector: 'app-request-status-table',
    standalone: true,
    imports: [
        ActiveStatusComponent,
        BreadcrumbComponent,
        FormsModule,
        NgForOf,
        NgIf,
        NgbPagination,
        NgbPaginationNext,
        NgbPaginationPrevious,
        TranslocoModule
    ],
    templateUrl: './request-status-table.component.html',
    styleUrl: './request-status-table.component.scss'
})
export class RequestStatusTableComponent {
    private modalService = inject(NgbModal);
    filter: RequestStatusFilter = {
        search: null,
        perPage: 10,
        page: 1,
        requestTypeId: null
    };
    requestStatus: RequestStatusPaginate = null;
    private destroy$ = new Subject<void>();
    isLoading = true;
    deleteRequestStatusId: number;
    @Input() requestTypeId: number;

    constructor(config: NgbModalConfig,
                private spinner: NgxSpinnerService,
                private store: Store) {
        this.store.select(selectRequestStatus).pipe(
            takeUntil(this.destroy$)
        ).subscribe(requestStatus => {
            this.requestStatus = requestStatus;
        });
        this.store.select(isRequestStatusGridLoading).pipe(
            takeUntil(this.destroy$)
        ).subscribe(loading => {
            this.isLoading = loading;
        });
        config.backdrop = 'static';
        config.keyboard = false;
    }

    ngOnInit() {
        this.filter.requestTypeId = this.requestTypeId;
        this.getAllRequestStatus();
    }

    onSearch() {
        this.getAllRequestStatus();
    }

    showDeleteAlert(requestStatusId: number) {
        this.deleteRequestStatusId = requestStatusId;
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
                this.deleteRequestStatusId = undefined;
            }
        });
    }

    getAllRequestStatus() {
        this.store.dispatch(getAllRequestStatus({data: this.filter}));
    }

    onRowsChange(event: any): void {
        this.filter.perPage = event.target.value;
        this.getAllRequestStatus();
    }

    goToAdd() {
        const modalRef = this.modalService.open(RequestStatusFormComponent);
        this.store.dispatch(showHideRequestStatusForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Add Request Status';
        modalRef.componentInstance.requestTypeId = this.requestTypeId;
        modalRef.result.then((data) => {
            this.getAllRequestStatus();
        });
    }

    goToEdit(requestStatus: RequestStatus) {
        const modalRef = this.modalService.open(RequestStatusFormComponent);
        this.store.dispatch(showHideRequestStatusForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit Request Status';
        modalRef.componentInstance.editRequestStatus = requestStatus;
        modalRef.result.then((data) => {
            this.getAllRequestStatus();
        });
    }

    onPageChange(event: any) {
        this.filter.page = event;
        this.getAllRequestStatus();
    }

    onDelete() {
        //  this.spinner.show();
        this.store.dispatch(deleteRequestStatus({data: this.deleteRequestStatusId}));
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
