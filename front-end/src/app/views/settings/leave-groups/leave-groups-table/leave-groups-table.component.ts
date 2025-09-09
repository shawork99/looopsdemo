import {Component, inject, OnInit} from '@angular/core';
import {ActiveStatusComponent} from "@/app/shared/components/active-status/active-status.component";
import {BreadcrumbComponent} from "@components/breadcrumb/breadcrumb.component";
import {NgForOf, NgIf} from "@angular/common";
import {
    NgbModal,
    NgbModalConfig,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslocoPipe} from "@jsverse/transloco";
import {Subject, takeUntil} from "rxjs";
import {Store} from "@ngrx/store";
import Swal from "sweetalert2";
import {LeaveGroup, LeaveGroupFilter, LeaveGroupPaginate} from "@store/leave_group/leave_group.model";
import {isLeaveGroupsGridLoading, selectLeaveGroups} from "@store/leave_group/leave_group.selector";
import {deleteLeaveGroup, getAllLeaveGroups, showHideLeaveGroupForm} from "@store/leave_group/leave_group.actions";
import {LeaveGroupsFormComponent} from "@views/settings/leave-groups/leave-groups-form/leave-groups-form.component";
import {
    LeaveGroupDetailsFormComponent
} from "@views/settings/leave-groups/leave-group-details-form/leave-group-details-form.component";

@Component({
    selector: 'app-leave-groups-table',
    imports: [
        ActiveStatusComponent,
        BreadcrumbComponent,
        NgForOf,
        NgIf,
        NgbPagination,
        NgbPaginationNext,
        NgbPaginationPrevious,
        ReactiveFormsModule,
        TranslocoPipe,
        FormsModule
    ],
    templateUrl: './leave-groups-table.component.html',
    styleUrl: './leave-groups-table.component.scss'
})
export class LeaveGroupsTableComponent implements OnInit {

    private modalService = inject(NgbModal);
    filter: LeaveGroupFilter = {
        search: null,
        perPage: 10,
        page: 1
    };
    leaveGroups: LeaveGroupPaginate = null;
    private destroy$ = new Subject<void>();
    isLoading: boolean = true;
    deleteLeaveGroupId: number;

    constructor(config: NgbModalConfig,
                private store: Store) {
        this.store.select(selectLeaveGroups).pipe(
            takeUntil(this.destroy$)
        ).subscribe((leaveGroups: LeaveGroupPaginate) => {
            this.leaveGroups = leaveGroups;
        });
        this.store.select(isLeaveGroupsGridLoading).pipe(
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
        this.getAllLeaveGroups();
    }

    onSearch() {
        this.getAllLeaveGroups();
    }

    showDeleteAlert(LeaveGroupId: number) {
        this.deleteLeaveGroupId = LeaveGroupId;
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
                this.deleteLeaveGroupId = undefined;
            }
        });
    }

    getAllLeaveGroups() {
        this.store.dispatch(getAllLeaveGroups({data: this.filter}));
    }

    onRowsChange(event: any): void {
        this.filter.perPage = event.target.value;
        this.getAllLeaveGroups();
    }

    goToAdd() {
        const modalRef = this.modalService.open(LeaveGroupsFormComponent);
        this.store.dispatch(showHideLeaveGroupForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Add Leave Type';
        modalRef.result.then((data) => {
            this.getAllLeaveGroups();
        });
    }

    goToEdit(leaveGroup: LeaveGroup) {
        const modalRef = this.modalService.open(LeaveGroupsFormComponent);
        this.store.dispatch(showHideLeaveGroupForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit Leave Type';
        modalRef.componentInstance.editLeaveGroup = leaveGroup;
        modalRef.result.then((data) => {
            this.getAllLeaveGroups();
        });
    }

    goToDetails(leaveGroup: LeaveGroup) {
        const modalRef = this.modalService.open(LeaveGroupDetailsFormComponent, {size: 'xl'});
        modalRef.componentInstance.modalHeader = 'Edit Leave Group Details';
        modalRef.componentInstance.modalHeader = 'Edit Leave Group Details';
        modalRef.componentInstance.leaveGroupId = leaveGroup?.id;
    }

    onPageChange(event: any) {
        this.filter.page = event;
        this.getAllLeaveGroups();
    }

    onDelete() {
        this.store.dispatch(deleteLeaveGroup({data: this.deleteLeaveGroupId}));
    }
}
