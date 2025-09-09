import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadCompanyInfo, updateCompanyInfo } from "@store/company_configuration/company_configuration.action";
import { selectCompany, selectCompanyLoading } from "@store/company_configuration/company_configuration.selector";
import { Company } from "@store/company_configuration/company_configuration.model";
import { AsyncPipe, CommonModule, NgClass, NgIf } from '@angular/common';  
import { TranslocoModule } from '@jsverse/transloco';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleSwitchComponentComponent } from '@/app/shared/components/toggle-switch-component/toggle-switch-component.component';
import { CompanyConfigurationService } from '@/app/services/company-configuration.service';
import {TranslocoPipe} from "@jsverse/transloco";
import { BreadcrumbComponent } from "@components/breadcrumb/breadcrumb.component";
import { AlertService } from '@/app/services/alert.service';

@Component({
  selector: 'app-company-form',
  templateUrl: './company-form.component.html',
  styleUrls: ['./company-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgClass,
    TranslocoModule,
    ToggleSwitchComponentComponent,
    TranslocoPipe,
    BreadcrumbComponent
]
})
export class CompanyFormComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  company$: Observable<Company>;
  loading$: Observable<boolean>;
  isCompany: Company;

  previewImage: string | null = null;
   base64Image: string | null = null;

  currencies: { id: number; code: string; name: string }[] = [];

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private companyService: CompanyConfigurationService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.company$ = this.store.select(selectCompany);
    this.loading$ = this.store.select(selectCompanyLoading);

    this.store.dispatch(loadCompanyInfo());

    this.form = this.fb.group({
      id : [null],
      name: ['', Validators.required],
      company_code: [{ value: '', disabled: true }],
      country: [''],
      currency: [''],      
      time_zone: [''],
      contact_person: [''],
      contact_email: ['', [Validators.required, Validators.email]],
      contact_no: [''],
      company_start_date: [''],
      memo: [''],
      is_active: [true],
      company_logo: [''] 
    });

    this.company$.subscribe(company => {
      if (!company) return;
      const patch = {
        ...company,
        id: company.id,
        currency: (company as any).currency?.id ?? company.currency,
        company_logo: company.company_logo
      };
      this.previewImage = company.company_logo; 
      this.form.patchValue(patch);
    });

    this.companyService.getCurrencies().subscribe(data => {
      this.currencies = data;
    });
  }


  onSubmit(): void {
  this.submitted = true;
    if (this.form.invalid) {
        this.alertService.showError('Please fill all required fields correctly.');
        return;
      }
  const formData = this.form.getRawValue();
  this.store.dispatch(updateCompanyInfo({ id: formData.id, data: formData }));
  }

  onCompanyLogoUpdated(event: any) {
    const file: File = event.target.files[0];
    if (!file) {
      alert("No file selected");
      return;
    }
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      this.alertService.showError("Only JPEG and PNG are allowed");
      return;
    }
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      this.base64Image = null;
      this.previewImage = null;
      this.alertService.showError("File size exceeds 5 MB limit");
      alert();
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.base64Image = reader.result as string;
      this.previewImage = reader.result as string;
      this.form.patchValue({ company_logo: this.base64Image });
    };
    reader.readAsDataURL(file);
  }


}
