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
import {Designation, DesignationFilter, DesignationPaginate} from "@store/designation/designation.model";
import {isDesignationsGridLoading, selectDesignations} from "@store/designation/designation.selector";
import {deleteDesignation, getAllDesignation, showHideDesignationForm} from "@store/designation/designation.actions";
import {DesignationFormComponent} from "@views/settings/designation/designation-form/designation-form.component";

@Component({
    selector: 'app-designation-table',
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
    templateUrl: './designation-table.component.html',
    styleUrl: './designation-table.component.scss'
})
export class DesignationTableComponent {
    private modalService = inject(NgbModal);
    filter: DesignationFilter = {
        search: null,
        perPage: 10,
        page: 1
    };
    designations: DesignationPaginate = null;
    private destroy$ = new Subject<void>();
    isLoading = true;
    deleteDesignationId: number;

    constructor(config: NgbModalConfig,
                private spinner: NgxSpinnerService,
                private store: Store) {
        this.store.select(selectDesignations).pipe(
            takeUntil(this.destroy$)
        ).subscribe(designations => {
            this.designations = designations;
        });
        this.store.select(isDesignationsGridLoading).pipe(
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
        this.getAllDesignation();
    }

    onSearch() {
        this.getAllDesignation();
    }

    showDeleteAlert(DesignationId: number) {
        this.deleteDesignationId = DesignationId;
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
                this.deleteDesignationId = undefined;
            }
        });
    }

    getAllDesignation() {
        this.store.dispatch(getAllDesignation({data: this.filter}));
    }

    onRowsChange(event: any): void {
        this.filter.perPage = event.target.value;
        this.getAllDesignation();
    }

    goToAdd() {
        const modalRef = this.modalService.open(DesignationFormComponent);
        this.store.dispatch(showHideDesignationForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Add Designation';
        modalRef.result.then((data) => {
            this.getAllDesignation();
        });
    }

    goToEdit(Designation: Designation) {
        const modalRef = this.modalService.open(DesignationFormComponent);
        this.store.dispatch(showHideDesignationForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit Designation';
        modalRef.componentInstance.editDesignation = Designation;
        modalRef.result.then((data) => {
            this.getAllDesignation();
        });
    }

    onPageChange(event: any) {
        this.filter.page = event;
        this.getAllDesignation();
    }

    onDelete() {
        //  this.spinner.show();
        this.store.dispatch(deleteDesignation({data: this.deleteDesignationId}));
    }
}
