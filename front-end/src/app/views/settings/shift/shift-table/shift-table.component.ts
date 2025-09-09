import {Component, inject} from '@angular/core';
import {ActiveStatusComponent} from "@/app/shared/components/active-status/active-status.component";
import {BreadcrumbComponent} from "@components/breadcrumb/breadcrumb.component";
import {NgForOf, NgIf} from "@angular/common";
import {
    NgbModal,
    NgbModalConfig,
    NgbPagination, NgbPaginationModule,
    NgbPaginationNext,
    NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TranslocoPipe} from "@jsverse/transloco";
import {Shift, ShiftFilter, ShiftPaginate} from "@store/shift/shift.model";
import {Subject, takeUntil} from "rxjs";
import {NgxSpinnerService} from "ngx-spinner";
import {Store} from "@ngrx/store";
import {isShiftGridLoading, selectShifts} from "@store/shift/shift.selector";
import {deleteShift, getAllShifts, showHideShiftForm} from "@store/shift/shift.actions";
import {ShiftFormComponent} from "@views/settings/shift/shift-form/shift-form.component";
import Swal from "sweetalert2";

@Component({
    selector: 'app-shift-table',
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
        FormsModule,
        NgbPagination,
        NgbPaginationNext,
        NgbPaginationPrevious,
        NgbPaginationModule,
    ],
    templateUrl: './shift-table.component.html',
    styleUrl: './shift-table.component.scss'
})
export class ShiftTableComponent {
    private modalService = inject(NgbModal);
    filter: ShiftFilter = {
        search: null,
        perPage: 10,
        page: 1
    };
    shifts: ShiftPaginate = null;
    private destroy$ = new Subject<void>();
    isLoading = true;
    deleteShiftId: number;


    constructor(config: NgbModalConfig,
                private spinner: NgxSpinnerService,
                private store: Store) {
        this.store.select(selectShifts).pipe(
            takeUntil(this.destroy$)
        ).subscribe(shift => {
            this.shifts = shift;
        });
        this.store.select(isShiftGridLoading).pipe(
            takeUntil(this.destroy$)
        ).subscribe(loading => {
            this.isLoading = loading;
        });
        config.backdrop = 'static';
        config.keyboard = false;
    }

    ngOnInit() {
        this.getAllShifts();
    }

    onSearch() {
        this.filter.page = 1;
        this.getAllShifts();
    }

    getAllShifts() {
        this.store.dispatch(getAllShifts({data: this.filter}));
    }

    onRowsChange(event: any): void {
        this.filter.perPage = event.target.value;
        this.getAllShifts();
    }

    goToAdd() {
        const modalRef = this.modalService.open(ShiftFormComponent, {size: 'xl'});
        this.store.dispatch(showHideShiftForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Add Shift';
        modalRef.result.then(() => {
            this.getAllShifts();
        });
    }

    goToEdit(shift: Shift) {
        const modalRef = this.modalService.open(ShiftFormComponent, {size: 'xl'});
        this.store.dispatch(showHideShiftForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit Shift';
        modalRef.componentInstance.editShiftId = shift?.id;
        modalRef.result.then(() => {
            this.getAllShifts();
        });
    }

    showDeleteAlert(shiftId: number) {
        this.deleteShiftId = shiftId;
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
                this.deleteShiftId = undefined;
            }
        });
    }

    onDelete() {
        this.store.dispatch(deleteShift({data: this.deleteShiftId}));
    }

    onPageChange(event: any) {
        this.filter.page = event;
        this.getAllShifts();
    }
}
