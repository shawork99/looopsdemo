import { Component } from '@angular/core'
import { FormBuilder, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import { Store } from '@ngrx/store';
import {recoverPassword,recoverPasswordReset} from '@store/authentication/authentication.actions'
import { 
    selectRecoverPasswordLoading, 
    selectRecoverPasswordMessage, 
    selectRecoverPasswordError 
} from '@store/authentication/authentication.selector';
import { Observable } from 'rxjs';
import { AlertService } from '@/app/services/alert.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-recover-pasword',
     imports: [RouterLink, ReactiveFormsModule,CommonModule], 
    templateUrl: './recover-pasword.component.html',
    styles: ``
})
export class RecoverPaswordComponent {
    recoverForm:FormGroup;
    loading$: Observable<boolean>;
    message$: Observable<string | null>;
    error$: Observable<string | null>;
    isSubmitting = false;

    constructor(private fb:FormBuilder,private store:Store, private alertService: AlertService){
        this.recoverForm=this.fb.group({
            email:['',[Validators.required,Validators.email]]
        });
    }

    ngOnInit() {
        this.recoverForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        });

        this.loading$ = this.store.select(selectRecoverPasswordLoading);
        this.message$ = this.store.select(selectRecoverPasswordMessage);
        this.error$ = this.store.select(selectRecoverPasswordError);

        // Subscribe to message & error to show alert
        this.message$.subscribe(msg => {
        if (msg) this.alertService.showSuccess(msg);
        this.isSubmitting = false; 
        this.store.dispatch(recoverPasswordReset()); 
        });
        this.error$.subscribe(err => {
        if (err) this.alertService.showError(err);
        this.isSubmitting = false; 
        this.store.dispatch(recoverPasswordReset());
        });
    }

    onSubmit(){
        
         if (!this.recoverForm.valid) {
            const emailControl = this.recoverForm.get('email');

            if (emailControl?.hasError('required')) {
            this.alertService.showError('Please enter your registered email.');
            } else if (emailControl?.hasError('email')) {
            this.alertService.showError('Please enter a valid email address.');
            }

            return;
        }


        if(this.recoverForm.valid){
            const email=this.recoverForm.value.email;
            this.isSubmitting = true; 
            this.store.dispatch(recoverPassword({email}));
        }
    }
}
