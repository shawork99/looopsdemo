import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '@/app/services/alert.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { ToggleSwitchComponentComponent } from '@/app/shared/components/toggle-switch-component/toggle-switch-component.component';
import { TranslocoModule } from '@jsverse/transloco';

import { Supplier } from '@store/suppliers/supplier.model';
import {
  createSupplier,
  showSupplierFormLoading,
  updateSupplier
} from '@store/suppliers/supplier.actions';
import {
  selectShowSupplierFormLoading,
  selectShowHideSupplierForm
} from '@store/suppliers/supplier.selectors';

@Component({
  selector: 'app-suppliers-form',
  templateUrl: './suppliers-form.component.html',
  styleUrl: './suppliers-form.component.scss',
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
export class SuppliersFormComponent implements OnInit {
  public store = inject(Store);
  modalHeader: string;
  submitted = false;
  form: FormGroup = new FormGroup({
    supplier_code: new FormControl(null, Validators.required),
    person_name: new FormControl(null, Validators.required),
    email: new FormControl(null),
    contact_number: new FormControl(null),
    address: new FormControl(null),
    company_name: new FormControl(null, Validators.required),
    business_register_number: new FormControl(null),
    status: new FormControl('1', Validators.required)
  });
  editSupplier: Supplier;
  private destroy$ = new Subject<void>();
  isLoading$ = this.store.select(selectShowSupplierFormLoading);

  constructor(public modal: NgbActiveModal, private alertService: AlertService) {
    this.store.select(selectShowHideSupplierForm).pipe(takeUntil(this.destroy$)).subscribe((show) => {
      if (!show) this.modal.close();
    });
  }

  ngOnInit(): void {
    if (this.editSupplier) {
      this.form.patchValue(this.editSupplier);
    }
  }

  onStatusChange(value: any) {
   this.form.patchValue({ status: value ? 1 : 0 });
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

    this.store.dispatch(showSupplierFormLoading({ show: true }));

    if (this.editSupplier) {
      this.store.dispatch(updateSupplier({ supplierId: this.editSupplier.id, data: this.form.value }));
    } else {
      this.store.dispatch(createSupplier({ data: this.form.value }));
    }
  }
}
