import {Component, inject} from '@angular/core';
import {ActiveStatusComponent} from '@/app/shared/components/active-status/active-status.component';
import {BreadcrumbComponent} from '@components/breadcrumb/breadcrumb.component';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {
    NgbModal,
    NgbModalConfig,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious
} from '@ng-bootstrap/ng-bootstrap';
import {Subject, takeUntil} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {Store} from '@ngrx/store';
import Swal from 'sweetalert2';

import {Location, LocationFilter, LocationPaginate} from '@store/location/location.model';
import {
    isLocationsGridLoading,
    selectLocations
} from '@store/location/location.selectors';
import {
    deleteLocation,
    getAllLocations,
    showHideLocationForm
} from '@store/location/location.actions';
import {LocationsFormComponent} from '@views/settings/locations/locations-form/locations-form.component';
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
    selector: 'app-locations-table',
    templateUrl: './locations-table.component.html',
    styleUrl: './locations-table.component.scss',
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
        TranslocoPipe
    ]
})
export class LocationsTableComponent {
    private modalService = inject(NgbModal);
    filter: LocationFilter = {
        search: null,
        perPage: 10,
        page: 1
    };
    locations: LocationPaginate = null;
    private destroy$ = new Subject<void>();
    isLoading = true;
    deleteLocationId: number;

    constructor(config: NgbModalConfig, private spinner: NgxSpinnerService, private store: Store) {
        this.store.select(selectLocations).pipe(takeUntil(this.destroy$)).subscribe((locations) => {
            this.locations = locations;
        });

        this.store.select(isLocationsGridLoading).pipe(takeUntil(this.destroy$)).subscribe((loading) => {
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
        this.getAllLocations();
    }

    onSearch() {
        this.getAllLocations();
    }

    showDeleteAlert(locationId: number) {
        this.deleteLocationId = locationId;
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
                this.deleteLocationId = undefined;
            }
        });
    }

    getAllLocations() {
        this.store.dispatch(getAllLocations({data: this.filter}));
    }

    onRowsChange(event: any): void {
        this.filter.perPage = event.target.value;
        this.getAllLocations();
    }

    goToAdd() {
        const modalRef = this.modalService.open(LocationsFormComponent);
        this.store.dispatch(showHideLocationForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Add Location';
        modalRef.result.then(() => {
            this.getAllLocations();
        });
    }

    goToEdit(location: Location) {
        const modalRef = this.modalService.open(LocationsFormComponent);
        this.store.dispatch(showHideLocationForm({show: true}));
        modalRef.componentInstance.modalHeader = 'Edit Location';
        modalRef.componentInstance.editLocation = location;
        modalRef.result.then(() => {
            this.getAllLocations();
        });
    }

    onPageChange(event: any) {
        this.filter.page = event;
        this.getAllLocations();
    }

    onDelete() {
        // this.spinner.show();
        this.store.dispatch(deleteLocation({data: this.deleteLocationId}));
    }
}
