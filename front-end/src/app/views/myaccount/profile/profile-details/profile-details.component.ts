import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { TranslocoModule, TranslocoPipe } from '@jsverse/transloco';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { profile } from '@store/profile-details/profile_details.model';
import { loadProfileDetails, updateProfileDetails } from '@store/profile-details/profile_details.action';
import { selectProfileDetails, selectProfileLoading } from '@store/profile-details/profile_details.selector';
import { ProfileDetailsService } from '@/app/services/profile-details.service';
import { AlertService } from '@/app/services/alert.service';
import { BreadcrumbComponent } from '@components/breadcrumb/breadcrumb.component';
import { ToggleSwitchComponentComponent } from '@/app/shared/components/toggle-switch-component/toggle-switch-component.component';
import { AboutComponent } from './components/about/about.component';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    NgbNavModule,
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgClass,
    TranslocoModule,
    TranslocoPipe,
    ToggleSwitchComponentComponent,
    BreadcrumbComponent,
    AboutComponent
  ]
})
export class ProfileDetailsComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  profile$: Observable<profile | null>;
  loading$: Observable<boolean>;
  profileData: profile | null = null;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private profileService: ProfileDetailsService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.profile$ = this.store.select(selectProfileDetails);
    this.loading$ = this.store.select(selectProfileLoading);

    this.store.dispatch(loadProfileDetails());

    this.form = this.fb.group({
      id: [null],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      calling_name: [''],
      employee_code: [''],
      contact_no: [''],
      address: [''],
      country: [''],
      department: [''],
      designation: ['']
    });

    this.profile$.subscribe(profile => {
      if (!profile) return;
     
      this.profileData = profile;

      const patch = {
        ...profile,
        id: profile.id
      };

      this.form.patchValue(patch);
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.form.invalid) {
      this.alertService.showError('Please fill all required fields correctly.');
      return;
    }

    const formData = this.form.getRawValue();
    this.store.dispatch(updateProfileDetails({ id: formData.id, data: formData }));
  }
}
