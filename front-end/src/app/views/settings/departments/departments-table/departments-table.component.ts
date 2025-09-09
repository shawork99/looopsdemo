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
import {Subject, takeUntil} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {Store} from "@ngrx/store";
import Swal from "sweetalert2";
import {Department, DepartmentFilter, DepartmentPaginate} from "@store/department/department.model";
import {isDepartmentsGridLoading, selectDepartments} from "@store/department/department.selector";
import {deleteDepartment, getAllDepartments, showHideDepartmentForm} from "@store/department/department.actions";
import {DepartmentsFormComponent} from "@views/settings/departments/departments-form/departments-form.component";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
    selector: 'app-departments-table',
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
    templateUrl: './departments-table.component.html',
    styleUrl: './departments-table.component.scss'
})
export class DepartmentsTableComponent {
    private modalService = inject(NgbModal);
    filter: DepartmentFilter = {
        search: null,
        perPage: 10,
        page: 1
    };
    departments: DepartmentPaginate = null;
    private destroy$ = new Subject<void>();
    isLoading = true;
    deleteDepartmentId: number;

    constructor(config: NgbModalConfig,
                private spinner: NgxSpinnerService,
                private store: Store) {
        this.store.select(selectDepartments).pipe(
            takeUntil(this.destroy$)
        ).subscribe(departments => {
            this.departments = departments;
        });
        this.store.select(isDepartmentsGridLoading).pipe(
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
        this.getAllDepartments();
    }

    onSearch() {
        this.getAllDepartments();
    }

    showDeleteAlert(departmentId: number) {
        this.deleteDepartmentId = departmentId;
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
                this.deleteDepartmentId = undefined;
            }
        });
    }

    getAllDepartments() {
        this.store.dispatch(getAllDepartments({data: this.filter}));
    }

    onRowsChange(event: any): void {
        this.filter.perPage = event.target.value;
        this.getAllDepartments();
    }

    goToAdd() {
        const modalRef = this.modalService.open(DepartmentsFormComponent);
        this.store.dispatch(showHideDepartmentForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Add Department';
        modalRef.result.then((data) => {
            this.getAllDepartments();
        });
    }

    goToEdit(department: Department) {
        const modalRef = this.modalService.open(DepartmentsFormComponent);
        this.store.dispatch(showHideDepartmentForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit Department';
        modalRef.componentInstance.editDepartment = department;
        modalRef.result.then((data) => {
            this.getAllDepartments();
        });
    }

    onPageChange(event: any) {
        this.filter.page = event;
        this.getAllDepartments();
    }

    onDelete() {
        //  this.spinner.show();
        this.store.dispatch(deleteDepartment({data: this.deleteDepartmentId}));

    }
}
