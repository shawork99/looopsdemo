import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { profile } from '@store/profile-details/profile_details.model';
import { Store } from '@ngrx/store';
import * as ProfileActions from '@store/profile-details/profile_details.action';
import { AlertService } from '@/app/services/alert.service'; 


@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {
  @Input() profile: profile | null = null;

  passwordForm: FormGroup;
  submitted = false;
  oldPassword = false;
  showConfirmPassword = false;
  newPassword = false;

  constructor(private fb: FormBuilder,private store: Store,private alertService: AlertService) {
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      password: ['', [Validators.required, Validators.maxLength(12)]],
      password_confirmation: ['', [Validators.required, Validators.maxLength(12)]]
    });
  }

  ngOnInit(): void {}

onPasswordSubmit(): void {
  this.submitted = true;
  if (this.passwordForm.invalid || !this.profile) {
    this.alertService.showError('Please fill all required fields before submitting'); 
    return;
  }

  const payload = this.passwordForm.value;
  this.store.dispatch(ProfileActions.updatePassword({ id: this.profile.id, data: payload }));
}


  onCancel(): void {
    this.passwordForm.reset();
    this.submitted = false;
  }
}
