import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Role, RoleFilter, RolePaginate} from "@store/role/role.model";
import {BreadcrumbComponent} from "@components/breadcrumb/breadcrumb.component";
import {
    NgbModal,
    NgbModalConfig,
    NgbPagination, NgbPaginationModule,
    NgbPaginationNext,
    NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import {RoleFormComponent} from "@views/settings/role/role-form/role-form.component";
import {Store} from "@ngrx/store";
import {isRolesGridLoading, selectRoles} from "@store/role/role.selector";
import {Subject, takeUntil} from "rxjs";
import {NgForOf, NgIf} from "@angular/common";
import {ActiveStatusComponent} from "@/app/shared/components/active-status/active-status.component";
import {deleteRole, getAllRoles, showHideRoleForm} from "@store/role/role.actions";
import {NgxSpinnerService} from "ngx-spinner";
import {FormsModule} from "@angular/forms";
import Swal from 'sweetalert2';
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
    selector: 'app-role-table',
    imports: [
        BreadcrumbComponent,
        NgForOf,
        ActiveStatusComponent,
        NgIf,
        NgbPagination,
        NgbPaginationNext,
        NgbPaginationPrevious,
        NgbPaginationModule,
        FormsModule,
        TranslocoPipe
    ],
    templateUrl: './role-table.component.html',
    styleUrl: './role-table.component.scss'
})
export class RoleTableComponent implements OnDestroy, OnInit {
    private modalService = inject(NgbModal);
    filter: RoleFilter = {
        search: null,
        perPage: 10,
        page: 1
    };
    roles: RolePaginate = null;
    private destroy$ = new Subject<void>();
    isLoading = true;
    deleteRoleId: number;

    constructor(config: NgbModalConfig,
                private spinner: NgxSpinnerService,
                private store: Store) {
        this.store.select(selectRoles).pipe(
            takeUntil(this.destroy$)
        ).subscribe(roles => {
            this.roles = roles;
        });
        this.store.select(isRolesGridLoading).pipe(
            takeUntil(this.destroy$)
        ).subscribe(loading => {
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
        this.getAllRoles();
    }

    onSearch() {
        this.filter.page = 1;
        this.getAllRoles();
    }

    showDeleteAlert(roleId: number) {
        this.deleteRoleId = roleId;
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
                this.deleteRoleId = undefined;
            }
        });
    }

    getAllRoles() {
        this.store.dispatch(getAllRoles({data: this.filter}));
    }

    onRowsChange(event: any): void {
        this.filter.perPage = event.target.value;
        this.getAllRoles();
    }

    goToAdd() {
        const modalRef = this.modalService.open(RoleFormComponent);
        this.store.dispatch(showHideRoleForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Add Role';
        modalRef.result.then(() => {
            this.getAllRoles();
        });
    }

    goToEdit(role: Role) {
        const modalRef = this.modalService.open(RoleFormComponent);
        this.store.dispatch(showHideRoleForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit Role';
        modalRef.componentInstance.editRole = role;
        modalRef.result.then(() => {
            this.getAllRoles();
        });
    }

    onPageChange(event: any) {
        this.filter.page = event;
        this.getAllRoles();
    }

    onDelete() {
        this.store.dispatch(deleteRole({data: this.deleteRoleId}));
    }
}