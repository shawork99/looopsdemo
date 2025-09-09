import { Component, inject } from '@angular/core';
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { Subject, takeUntil } from "rxjs";
import Swal from "sweetalert2";

import {
  Supplier,
  SupplierFilter,
  SupplierPaginate
} from "@store/suppliers/supplier.model";

import {
  loadSuppliers,
  deleteSupplier,
  showHideSupplierForm
} from "@store/suppliers/supplier.actions";

import { isSuppliersGridLoading,selectSuppliers } from "@store/suppliers/supplier.selectors";

import { SuppliersFormComponent } from "@views/settings/suppliers/supplier-form/suppliers-form.component";
import { ActiveStatusComponent } from "@/app/shared/components/active-status/active-status.component";
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf ,JsonPipe } from "@angular/common";
import { TranslocoPipe } from "@jsverse/transloco";
import { NgbPagination, NgbPaginationNext, NgbPaginationPrevious } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-supplier-table',
  templateUrl: './supplier-table.component.html',
  styleUrls: ['./supplier-table.component.scss'],
  standalone: true,
  imports: [
    ActiveStatusComponent,
    BreadcrumbComponent,
    FormsModule,
    NgForOf,
    NgIf,JsonPipe,
    NgbPagination,
    NgbPaginationNext,
    NgbPaginationPrevious,
    TranslocoPipe
  ]
})
export class SupplierTableComponent {
  private modalService = inject(NgbModal);
  private destroy$ = new Subject<void>();

    filter: SupplierFilter = { search: '', perPage: 10, page: 1 };
    suppliers: SupplierPaginate = null;
    isLoading = true;
    deleteSupplierId: number;

  constructor(config: NgbModalConfig, private store: Store) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.store.select(selectSuppliers).pipe(takeUntil(this.destroy$)).subscribe(data => {
      if (Array.isArray(data)) {
        this.suppliers = {
          current_page: 1,
          data: data,
          from: 1,
          last_page: 1,
          per_page: data.length,
          to: data.length,
          total: data.length
        };
      } else {
        this.suppliers = data;
      }
    });
    

    this.store.select(isSuppliersGridLoading).pipe(takeUntil(this.destroy$)).subscribe(flag => {
      this.isLoading = flag;
    });
  }

  ngOnInit() {
    this.getAllSuppliers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }


   getAllSuppliers() {
      this.store.dispatch(loadSuppliers({ data: this.filter }));
    }

  onSearch() {
    this.filter.page = 1; 
    this.getAllSuppliers();
  }

  onPageChange(page: number) {
    this.filter.page = page;
    this.getAllSuppliers();
  }

  onRowsChange(event: any) {
    this.filter.perPage = +event.target.value;
    this.getAllSuppliers();
  }

  goToAdd() {
    const modalRef = this.modalService.open(SuppliersFormComponent);
    modalRef.componentInstance.modalHeader = 'Add Supplier';
    this.store.dispatch(showHideSupplierForm({ show: true }));

    modalRef.result.then(() => this.getAllSuppliers());
  }

  goToEdit(supplier: Supplier) {
    const modalRef = this.modalService.open(SuppliersFormComponent);
    modalRef.componentInstance.modalHeader = 'Edit Supplier';
    modalRef.componentInstance.editSupplier = supplier;
    this.store.dispatch(showHideSupplierForm({ show: true }));

    modalRef.result.then(() => this.getAllSuppliers());
  }

  showDeleteAlert(supplierId: number) {
    this.deleteSupplierId = supplierId;
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      confirmButtonColor: '#d33',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.isConfirmed) {
        this.onDelete();
      } else {
        this.deleteSupplierId = undefined;
      }
    });
  }

  onDelete() {
    this.store.dispatch(deleteSupplier({ data: this.deleteSupplierId }));
  }
}
