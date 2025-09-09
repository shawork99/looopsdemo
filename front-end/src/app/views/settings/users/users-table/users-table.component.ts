import {Component, inject} from '@angular/core';
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
import {NgxSpinnerService} from "ngx-spinner";
import {Store} from "@ngrx/store";
import Swal from "sweetalert2";
import {User, UserFilter, UserFormData, UserPaginate} from "@store/users/user.model";
import {isUsersGridLoading, selectUserFormData, selectUsers} from "@store/users/user.selector";
import {
    deleteUser,
    getAllUsers,
    getFormData,
    onResetUserPassword,
    onShowPasswordResetForm,
    showHideUserForm,
    onDownloadExcel
} from "@store/users/user.actions";
import {UsersFormComponent} from "@views/settings/users/users-form/users-form.component";
import {UserPasswordResetComponent} from "@views/settings/users/user-password-reset/user-password-reset.component";

@Component({
    selector: 'app-users-table',
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
    templateUrl: './users-table.component.html',
    styleUrl: './users-table.component.scss'
})
export class UsersTableComponent {
    private modalService = inject(NgbModal);
    users: UserPaginate = null;
    private destroy$ = new Subject<void>();
    isLoading = false;
    deleteUserId: number;
    formData: UserFormData = null;
    showFilters = false;
    filter: {
        search: string | null;
        perPage: number;
        page: number;
        department_id?: number | string;
        designation_id?: number | string;
        manager_id?: number | string;
        location_id?: number | string;
    } = {
        search: '',
        perPage: 10,
        page: 1,
        department_id: '',
        designation_id: '',
        manager_id: '',
        location_id: ''
    };

    constructor(config: NgbModalConfig,
                private spinner: NgxSpinnerService,
                private store: Store) {
        this.store.select(selectUsers).pipe(
            takeUntil(this.destroy$)
        ).subscribe(users => {
            this.users = users;
        });
        this.store.select(isUsersGridLoading).pipe(
            takeUntil(this.destroy$)
        ).subscribe(loading => {
            this.isLoading = loading;
        });
        this.store.select(selectUserFormData).pipe(
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

    get departments() { return this.formData?.departments || []; }
    get managers() {return this.formData?.users || [];}
    get designations() { return this.formData?.designations || []; }
    get locations() { return this.formData?.locations || []; }

    resetFilters() {
        this.filter.department_id = '';
        this.filter.designation_id = '';
        this.filter.manager_id = '';
        this.filter.location_id = '';
        this.filter.search = '';
        this.filter.page = 1;
        this.getsAllUsers();
    }

    ngOnInit() {
        this.store.dispatch(getFormData());
        this.getsAllUsers();
    }

    onSearch() {
        this.getsAllUsers();
    }

    showDeleteAlert(DesignationId: number) {
        this.deleteUserId = DesignationId;
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes'
        }).then((result) => {
            if (result.isConfirmed) {
                this.onDelete();
            } else {
                this.deleteUserId = undefined;
            }
        });
    }

    getsAllUsers() {
        this.store.dispatch(getAllUsers({data: this.filter}));
    }

    onRowsChange(event: any): void {
        this.filter.perPage = event.target.value;
        this.getsAllUsers();
    }

    goToAdd() {
        const modalRef = this.modalService.open(UsersFormComponent);
        this.store.dispatch(showHideUserForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Add User';
        modalRef.componentInstance.formData = this.formData;
        modalRef.result.then((data) => {
            this.getsAllUsers();
        });
    }

    onResetPassword(userId: number) {
        const modalRef = this.modalService.open(UserPasswordResetComponent);
        this.store.dispatch(onShowPasswordResetForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Reset User Password';
        modalRef.componentInstance.userId = userId;
    }

    goToEdit(user: User) {
        const modalRef = this.modalService.open(UsersFormComponent, {size: 'xl'});
        this.store.dispatch(showHideUserForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit User';
        modalRef.componentInstance.editUserId = user?.id;
        modalRef.componentInstance.formData = this.formData;
        modalRef.result.then((data) => {
            this.getsAllUsers();
        });
    }

    onPageChange(event: any) {
        this.filter.page = event;
        this.getsAllUsers();
    }

    onDelete() {
        this.store.dispatch(deleteUser({data: this.deleteUserId}));
    }

    toggleFilters() {
        this.showFilters = !this.showFilters;
    }

    onFilterChange() {
        this.filter.page = 1; // reset pagination
        this.getsAllUsers();
    }

    excelDownload(){
        Swal.fire({
            title: 'Are you sure?',
            text: 'You need to download User Excel.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, Download',
            cancelButtonText: 'No, Cancel',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
            this.store.dispatch(onDownloadExcel({ filters: this.filter }));
            }
        });
    }

}
