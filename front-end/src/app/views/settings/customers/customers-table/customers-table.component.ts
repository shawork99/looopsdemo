import { Component, inject } from '@angular/core';
import { NgbModal, NgbModalConfig } from "@ng-bootstrap/ng-bootstrap";
import { Store } from "@ngrx/store";
import { Subject, takeUntil } from "rxjs";
import Swal from "sweetalert2";

import { Customer, CustomerFilter, CustomerPaginate } from "@store/customer/customer.model";
import { isCustomersGridLoading, selectCustomers } from "@store/customer/customer.selectors";
import {
  deleteCustomer,
  getAllCustomers,
  showHideCustomerForm
} from "@store/customer/customer.actions";

import { CustomersFormComponent } from "@views/settings/customers/customers-form/customers-form.component";
import { ActiveStatusComponent } from "@/app/shared/components/active-status/active-status.component";
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";
import { FormsModule } from "@angular/forms";
import { NgForOf, NgIf } from "@angular/common";
import { TranslocoPipe } from "@jsverse/transloco";
import {
  NgbPagination,
  NgbPaginationNext,
  NgbPaginationPrevious
} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-customers-table',
  templateUrl: './customers-table.component.html',
  styleUrl: './customers-table.component.scss',
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
export class CustomersTableComponent {
  private modalService = inject(NgbModal);
  private destroy$ = new Subject<void>();

  filter: CustomerFilter = { search: '', perPage: 10, page: 1 };
  customers: CustomerPaginate = null;
  isLoading = true;
  deleteCustomerId: number;

  constructor(config: NgbModalConfig, private store: Store) {
    config.backdrop = 'static';
    config.keyboard = false;

    this.store.select(selectCustomers).pipe(takeUntil(this.destroy$)).subscribe(data => {
      this.customers = data;
    });

    this.store.select(isCustomersGridLoading).pipe(takeUntil(this.destroy$)).subscribe(flag => {
      this.isLoading = flag;
    });
  }

  ngOnInit() {
    this.getAllCustomers();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAllCustomers() {
    this.store.dispatch(getAllCustomers({ data: this.filter }));
  }

  onSearch() {
    this.getAllCustomers();
  }

  onPageChange(page: number) {
    this.filter.page = page;
    this.getAllCustomers();
  }

  onRowsChange(event: any) {
    this.filter.perPage = +event.target.value;
    this.getAllCustomers();
  }

  goToAdd() {
    const modalRef = this.modalService.open(CustomersFormComponent);
    modalRef.componentInstance.modalHeader = 'Add Customer';
    this.store.dispatch(showHideCustomerForm({ show: true }));

    modalRef.result.then(() => this.getAllCustomers());
  }

  goToEdit(customer: Customer) {
    const modalRef = this.modalService.open(CustomersFormComponent);
    modalRef.componentInstance.modalHeader = 'Edit Customer';
    modalRef.componentInstance.editCustomer = customer;
    this.store.dispatch(showHideCustomerForm({ show: true }));

    modalRef.result.then(() => this.getAllCustomers());
  }

  showDeleteAlert(customerId: number) {
    this.deleteCustomerId = customerId;
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
        this.deleteCustomerId = undefined;
      }
    });
  }

  onDelete() {
    this.store.dispatch(deleteCustomer({ data: this.deleteCustomerId }));
  }
}
