import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AsyncPipe, DatePipe, NgClass, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    ToggleSwitchComponentComponent
} from "@/app/shared/components/toggle-switch-component/toggle-switch-component.component";
import {TranslocoPipe} from "@jsverse/transloco";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {User, UserFormData} from "@store/users/user.model";
import {selectEditUserDetails, selectShowHideUserForm, selectShowUserFormLoading} from "@store/users/user.selector";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {createUser, getEditUserDetails, showUserFormLoading, updateUser} from "@store/users/user.actions";
import {ContactNoPickerComponent} from "@/app/shared/components/contact-no-picker/contact-no-picker.component";
import {ContactNoOutput} from "@/app/shared/model/contact-no.model";
import {CountryPicker, CountryPickerComponent} from "@/app/shared/components/country-picker/country-picker.component";
import {FormErrorsPipe} from "@/app/shared/pipes/form-errors.pipe";

@Component({
    selector: 'app-users-form',
    imports: [
        AsyncPipe,
        NgIf,
        ReactiveFormsModule,
        ToggleSwitchComponentComponent,
        TranslocoPipe,
        NgForOf,
        NgClass,
        NgTemplateOutlet,
        ContactNoPickerComponent,
        ContactNoPickerComponent,
        CountryPickerComponent,
        FormErrorsPipe
    ],
    providers: [DatePipe],
    templateUrl: './users-form.component.html',
    styleUrl: './users-form.component.scss'
})
export class UsersFormComponent implements OnInit, OnDestroy {
    public store = inject(Store);
    submitted = false;
    form: FormGroup;
    editUserId: number;
    editUser: User;
    private destroy$ = new Subject<void>();
    modalHeader: string;
    isLoading$ = this.store.select(selectShowUserFormLoading);
    formData: UserFormData = null;
    base64Image: string | null = null;
    previewImage: string | null = null;


    constructor(public modal: NgbActiveModal,
                private alertService: AlertService,
                private datePipe: DatePipe) {
        this.store.select(selectShowHideUserForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            if (!show) {
                this.modal.close()
            }
        });
    }

    ngOnInit(): void {
        if (this.editUserId) {
            this.store.dispatch(getEditUserDetails({userId: this.editUserId}));
            this.store.select(selectEditUserDetails).pipe(
                takeUntil(this.destroy$)
            ).subscribe((user: User) => {
                this.editUser = user;
                this.initForm();
            });
        } else {
            this.initForm();
        }
    }

    private initForm() {
        if (this.editUserId) {
            this.previewImage = this.editUser?.details?.profile_image;
            this.form = new FormGroup({
                first_name: new FormControl(this.editUser?.first_name || null, [
                    Validators.required,
                    Validators.maxLength(25)
                ]),
                last_name: new FormControl(this.editUser?.last_name || null, [
                    Validators.required,
                    Validators.maxLength(25)
                ]),
                calling_name: new FormControl(this.editUser?.calling_name || null, [
                    Validators.maxLength(50)
                ]),
                role_id: new FormControl(this.editUser?.role_id || null, Validators.required),
                email: new FormControl(this.editUser?.email || null,
                    [
                        Validators.required,
                        Validators.maxLength(30)
                    ]),
                is_active: new FormControl(this.editUser?.is_active || false, Validators.required),
                is_discharged: new FormControl(this.editUser?.is_discharged || false, Validators.required),
                department_id: new FormControl(this.editUser?.details?.department_id || null, Validators.required),
                designation_id: new FormControl(this.editUser?.details?.designation_id || null, Validators.required),
                id_number: new FormControl(this.editUser?.details?.id_number || null, [
                    Validators.maxLength(25)
                ]),
                employee_code_reference: new FormControl(this.editUser?.details?.employee_code_reference || null, [
                    Validators.maxLength(25)
                ]),
                shift_id: new FormControl(this.editUser?.details?.shift_id || null),
                profile_image: new FormControl(null),
                contact_no: new FormControl(this.editUser?.details?.contact_no || null, [
                    Validators.maxLength(20)
                ]),
                address: new FormControl(this.editUser?.details?.address || null, [
                    Validators.maxLength(150)
                ]),
                country: new FormControl(this.editUser?.details?.country || null, [
                    Validators.maxLength(20)
                ]),
                reporting_manager_id: new FormControl(this.editUser?.details?.reporting_manager_id || null),
                leave_group_id: new FormControl(this.editUser?.details?.leave_group_id || null),
                location_id: new FormControl(this.editUser?.details?.location_id || null),
                contact_number_office: new FormControl(this.editUser?.details?.contact_number_office || null, [
                    Validators.maxLength(20)
                ]),
                date_of_joined: new FormControl(this.editUser?.details?.date_of_joined ? this.datePipe.transform(this.editUser?.details?.date_of_joined, 'yyyy-MM-dd') : null),
                date_of_birth: new FormControl(this.editUser?.details?.date_of_birth ? this.datePipe.transform(this.editUser?.details?.date_of_birth, 'yyyy-MM-dd') : null),
                gender: new FormControl(this.editUser?.details?.gender || null, Validators.required),
            });
        } else {
            this.form = new FormGroup({
                first_name: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(25)
                ]),
                last_name: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(25)
                ]),
                role_id: new FormControl(null, Validators.required),
                email: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(30)
                ]),
                is_active: new FormControl(true, Validators.required),
                department_id: new FormControl(null, Validators.required),
                designation_id: new FormControl(null, Validators.required),
                password: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(12)
                ]),
                password_confirmation: new FormControl(null, [
                    Validators.required,
                    Validators.maxLength(12)
                ]),
                gender: new FormControl(null, Validators.required),
            });
        }
    }

    onStatusChange(event: any) {
        this.form.patchValue({is_active: event});

    }

    onProfilePicUpdated(event: any) {
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
        };
        reader.readAsDataURL(file);
    }

    onContactNoChanged(event: ContactNoOutput) {
        this.form.get('contact_no').setValue(event?.e164Number ? event?.e164Number : null);
    }

    onContactNoOfficeChanged(event: ContactNoOutput) {
        this.form.get('contact_number_office').setValue(event?.e164Number ? event?.e164Number : null);
    }

    onCountryChanged(event: CountryPicker) {
        this.form.get('country').setValue(event);
    }

    onDischargeChange(event: any) {
        this.form.patchValue({is_discharged: event});
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
        if (this.form.get('profile_image')) {
            this.form.get('profile_image').setValue(this.base64Image);
        }
        this.store.dispatch(showUserFormLoading({show: true}));
        if (this.editUser) {
            this.store.dispatch(updateUser({userId: this.editUser?.id, data: this.form.value}));
        } else {
            this.store.dispatch(createUser({data: this.form.value}));
        }
    }
}
