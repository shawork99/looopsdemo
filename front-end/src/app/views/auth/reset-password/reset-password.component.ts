import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { resetPassword, resetPasswordReset } from '@store/authentication/authentication.actions';
import { selectResetPasswordLoading, selectResetPasswordMessage, selectResetPasswordError } from '@store/authentication/authentication.selector';
import { Observable } from 'rxjs';
import { AlertService } from '@/app/services/alert.service';
import { ReactiveFormsModule } from '@angular/forms'; 
import { AuthenticationService } from '@/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [ReactiveFormsModule,CommonModule]
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token: string;
  loading$: Observable<boolean>;
  message$: Observable<string | null>;
  error$: Observable<string | null>;
  encryptedPayload: string;
  isValidLink: boolean = false; 
  errorMessage: string | null = null;
  passwordErrors: any = {};
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,    
    private alertService: AlertService,
    private authService: AuthenticationService
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.passwordErrors = {
      minLength: true,
      number: true,
      uppercase: true,
      lowercase: true,
      specialChar: true
    };
    
    this.encryptedPayload = this.route.snapshot.paramMap.get('payload') || '';
    this.loading$ = this.store.select(selectResetPasswordLoading);
    this.message$ = this.store.select(selectResetPasswordMessage);
    this.error$ = this.store.select(selectResetPasswordError);

    this.authService.verifyPayload(this.encryptedPayload).subscribe(res => {
      this.isValidLink = res.valid;
      if (res.valid) {
        this.isValidLink = true;
      } else {
        this.isValidLink = false;
        this.errorMessage = res.message || 'Invalid or expired link';
        this.resetForm.disable();
        console.log('Invalid payload ->', this.errorMessage); 
      }
    });
    

    this.message$.subscribe(msg => {
      if (msg) {
        this.alertService.showSuccess(msg);
        this.resetForm.disable();

        // Redirect to login
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);

        this.store.dispatch(resetPasswordReset());
      }
    });

    this.resetForm.get('password')?.valueChanges.subscribe(value => {
      this.passwordErrors = this.validatePassword(value);
      this.resetForm.updateValueAndValidity();
    });

    this.resetForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.resetForm.updateValueAndValidity();
    });

    this.error$.subscribe(err => {
      if (err) {
        if (err.toLowerCase().includes('invalid') || err.toLowerCase().includes('expired')) {
          this.resetForm.disable();
        }
        this.alertService.showError(err);
        this.store.dispatch(resetPasswordReset());
      }
    });
  }

  passwordsMatch(): boolean {
    const password = this.resetForm.get('password')?.value;
    const confirmPassword = this.resetForm.get('confirmPassword')?.value;
    return password && confirmPassword && password === confirmPassword;
  }


  onSubmit() {
    if (this.resetForm.valid) {
      const password_confirmation = this.resetForm.value.confirmPassword; 
      const password = this.resetForm.value.password;
      this.store.dispatch(resetPassword({ payload: this.encryptedPayload, password,password_confirmation }));
    }
  }

  validatePassword(value: string) {
    const errors: any = {};
    if (!value || value.length < 6) errors.minLength = true;
    if (!/[0-9]/.test(value)) errors.number = true;
    if (!/[A-Z]/.test(value)) errors.uppercase = true;
    if (!/[a-z]/.test(value)) errors.lowercase = true;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) errors.specialChar = true;
    return errors;
  }

  hasPasswordError(name: string): boolean {
    return !!this.passwordErrors[name];
  }

  hasPasswordPassed(name: string): boolean {
    return !this.passwordErrors[name];
  }

  passwordMatchValidator(form: FormGroup) {
    const pass = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return pass === confirm ? null : { mismatch: true };
  }

  passwordsMismatch(): boolean {
    const errors = this.resetForm.errors;
    return !!errors?.['mismatch'] && this.resetForm.get('confirmPassword')?.touched;
  }

  canSubmit(): boolean {
    const errors = this.resetForm.errors;
    return Object.keys(this.passwordErrors).length === 0 && !errors?.['mismatch'];
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }

}
