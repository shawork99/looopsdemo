import {Component, inject} from '@angular/core';
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
import {TranslocoPipe} from "@jsverse/transloco";
import {Subject, takeUntil} from "rxjs";
import {Store} from "@ngrx/store";
import Swal from "sweetalert2";
import {LeaveType, LeaveTypeFilter, LeaveTypePaginate} from "@store/leave_type/leave_type.model";
import {isLeaveTypesGridLoading, selectLeaveTypes} from "@store/leave_type/leave_type.selector";
import {deleteLeaveType, getAllLeaveTypes, showHideLeaveTypeForm} from "@store/leave_type/leave_type.actions";
import {LeaveTypeFormComponent} from "@views/settings/leave-type/leave-type-form/leave-type-form.component";

@Component({
    selector: 'app-leave-type-table',
    imports: [
        ActiveStatusComponent,
        BreadcrumbComponent,
        FormsModule,
        NgForOf,
        NgIf,
        NgbPagination,
        NgbPaginationNext,
        NgbPaginationPrevious,
        TranslocoPipe
    ],
    templateUrl: './leave-type-table.component.html',
    styleUrl: './leave-type-table.component.scss'
})
export class LeaveTypeTableComponent {
    private modalService = inject(NgbModal);
    filter: LeaveTypeFilter = {
        search: null,
        perPage: 10,
        page: 1
    };
    leaveTypes: LeaveTypePaginate = null;
    private destroy$ = new Subject<void>();
    isLoading: boolean = true;
    deleteLeaveTypeId: number;

    constructor(config: NgbModalConfig,
                private store: Store) {
        this.store.select(selectLeaveTypes).pipe(
            takeUntil(this.destroy$)
        ).subscribe(LeaveTypes => {
            this.leaveTypes = LeaveTypes;
        });
        this.store.select(isLeaveTypesGridLoading).pipe(
            takeUntil(this.destroy$)
        ).subscribe((loading: boolean) => {
            this.isLoading = loading;
        });
        config.backdrop = 'static';
        config.keyboard = false;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }


    ngOnInit() {
        this.getAllLeaveTypes();
    }

    onSearch() {
        this.getAllLeaveTypes();
    }

    showDeleteAlert(LeaveTypeId: number) {
        this.deleteLeaveTypeId = LeaveTypeId;
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
                this.deleteLeaveTypeId = undefined;
            }
        });
    }

    getAllLeaveTypes() {
        this.store.dispatch(getAllLeaveTypes({data: this.filter}));
    }

    onRowsChange(event: any): void {
        this.filter.perPage = event.target.value;
        this.getAllLeaveTypes();
    }

    goToAdd() {
        const modalRef = this.modalService.open(LeaveTypeFormComponent);
        this.store.dispatch(showHideLeaveTypeForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Add Leave Type';
        modalRef.result.then((data) => {
            this.getAllLeaveTypes();
        });
    }

    goToEdit(leaveType: LeaveType) {
        const modalRef = this.modalService.open(LeaveTypeFormComponent);
        this.store.dispatch(showHideLeaveTypeForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit Leave Type';
        modalRef.componentInstance.editLeaveType = leaveType;
        modalRef.result.then((data) => {
            this.getAllLeaveTypes();
        });
    }

    onPageChange(event: any) {
        this.filter.page = event;
        this.getAllLeaveTypes();
    }

    onDelete() {
        this.store.dispatch(deleteLeaveType({data: this.deleteLeaveTypeId}));
    }
}
