import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '@/app/services/alert.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ToggleSwitchComponentComponent } from '@/app/shared/components/toggle-switch-component/toggle-switch-component.component';
import { TranslocoModule } from '@jsverse/transloco';

import { Customer } from '@store/customer/customer.model';
import {
  createCustomer,
  showCustomerFormLoading,
  updateCustomer
} from '@store/customer/customer.actions';
import {
  selectShowCustomerFormLoading,
  selectShowHideCustomerForm
} from '@store/customer/customer.selectors';

@Component({
  selector: 'app-customers-form',
  templateUrl: './customers-form.component.html',
  styleUrl: './customers-form.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    NgClass,
    ToggleSwitchComponentComponent,
    TranslocoModule
  ]
})
export class CustomersFormComponent implements OnInit {
  public store = inject(Store);
  modalHeader: string;
  submitted = false;
  form: FormGroup = new FormGroup({
    customer_code: new FormControl(null, Validators.required),
    person_name: new FormControl(null, Validators.required),
    email: new FormControl(null, [Validators.required, Validators.email]),
    contact_number: new FormControl(null, Validators.required),
    address: new FormControl(null),
    company_name: new FormControl(null),
    business_registration_no: new FormControl(null),
    status: new FormControl('active', Validators.required)
  });
  editCustomer: Customer;
  private destroy$ = new Subject<void>();
  isLoading$ = this.store.select(selectShowCustomerFormLoading);

  constructor(public modal: NgbActiveModal, private alertService: AlertService) {
    this.store.select(selectShowHideCustomerForm).pipe(takeUntil(this.destroy$)).subscribe((show) => {
      if (!show) this.modal.close();
    });
  }

  ngOnInit(): void {
    if (this.editCustomer) {
      this.form.patchValue(this.editCustomer);
    }
  }

  onStatusChange(value: any) {
    this.form.patchValue({ status: value ? 'active' : 'inactive' });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
      this.alertService.showError('Please fill all required fields correctly.');
      return;
    }

    this.store.dispatch(showCustomerFormLoading({ show: true }));

    if (this.editCustomer) {
      this.store.dispatch(updateCustomer({ customerId: this.editCustomer.id, data: this.form.value }));
    } else {
      this.store.dispatch(createCustomer({ data: this.form.value }));
    }
  }
}
