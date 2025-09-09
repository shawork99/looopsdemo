import {Component, inject} from '@angular/core';
import {Store} from "@ngrx/store";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {
    onResetUserPassword,
    onShowPasswordResetForm,
    showUserFormLoading,
    onSendUserPasswordMail,
} from "@store/users/user.actions";
import {Subject, takeUntil} from "rxjs";
import {selectShowHidePasswordResetForm, selectShowUserFormLoading,selectSendMailLoading} from "@store/users/user.selector";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {FormErrorsPipe} from "@/app/shared/pipes/form-errors.pipe";
import {TranslocoPipe} from "@jsverse/transloco";
import { combineLatest, map } from 'rxjs';

@Component({
    selector: 'app-user-password-reset',
    imports: [
        AsyncPipe,
        FormErrorsPipe,
        NgIf,
        ReactiveFormsModule,
        TranslocoPipe,
        NgClass
    ],
    templateUrl: './user-password-reset.component.html',
    styleUrl: './user-password-reset.component.scss'
})
export class UserPasswordResetComponent {
    public store = inject(Store);
    private destroy$ = new Subject<void>();
    form: FormGroup = new FormGroup({
        user_id: new FormControl(null, [
            Validators.required
        ]),
        password: new FormControl(null, [
            Validators.required,
            Validators.maxLength(12)
        ]),
        password_confirmation: new FormControl(null, [
            Validators.required,
            Validators.maxLength(12)
        ])
    });
    modalHeader: string;
    submitted = false;
    userId: number;
    isLoading$ = this.store.select(selectShowUserFormLoading);
    isMailSending$ = this.store.select(selectSendMailLoading);
    showPassword = false;
    showConfirmPassword = false;

    constructor(public modal: NgbActiveModal,
                private alertService: AlertService) {
        this.store.select(selectShowHidePasswordResetForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            console.log('show',show)
            if (!show) {
                this.modal.close()
            }
        });
    }

    ngOnInit(): void {
        this.form.get('user_id').setValue(this.userId);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }


    onSubmit() {
        this.submitted = true;
        this.form.markAsTouched();
        if (this.form.invalid) {
            this.alertService.showError("Please fill all the required fields");
            return;
        }
        this.store.dispatch(showUserFormLoading({show: true}));
        this.store.dispatch(onResetUserPassword({data: this.form.value}));
    }

    sendMail() {
        if (!this.userId) {
            this.alertService.showError("User ID not found");
            return;
        }
        this.store.dispatch(onSendUserPasswordMail({ userId: this.userId }));
    }

    combinedLoading$ = combineLatest([this.isLoading$, this.isMailSending$]).pipe(
        map(([formLoading, mailLoading]) => formLoading || mailLoading)
    );

}