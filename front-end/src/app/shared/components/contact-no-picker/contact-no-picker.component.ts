import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxIntlTelInputModule, PhoneNumberFormat, SearchCountryField} from "ngx-intl-tel-input";
import {ContactNoOutput} from "@/app/shared/model/contact-no.model";

@Component({
    selector: 'app-contact-no-picker',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule,
        NgxIntlTelInputModule,
        ReactiveFormsModule,
        NgxIntlTelInputModule
    ],
    template: `
        <ng-container [formGroup]="phoneForm">
            <ngx-intl-tel-input
                    [cssClass]="'custom'"  
                    [enableAutoCountrySelect]="true"
                    [enablePlaceholder]="true"
                    [searchCountryFlag]="true"
                    [searchCountryField]="[
                  SearchCountryField.Iso2,
                  SearchCountryField.Name
                ]"
                    [selectFirstCountry]="false"
                    [maxLength]="15"
                    [phoneValidation]="true"
                    [separateDialCode]="separateDialCode"
                    [numberFormat]="PhoneNumberFormat.National"
                    [required]="required"
                    formControlName="phone"
                    id="phone"
                    (input)="onContactNoChanged()"
            >
            </ngx-intl-tel-input>
        </ng-container>
    `,
    styleUrl: './contact-no-picker.component.scss'
})
export class ContactNoPickerComponent implements OnInit {
    SearchCountryField = SearchCountryField;
    separateDialCode = false;
    PhoneNumberFormat = PhoneNumberFormat;
    phoneForm = new FormGroup({
        phone: new FormControl(null, [Validators.required])
    });
    @Input() required: boolean = false;
    @Input() value:string = null;
    @Output() onContactNoUpdate: EventEmitter<ContactNoOutput> = new EventEmitter<ContactNoOutput>();

    ngOnInit() {
        if (this.required) {
            this.phoneForm.get('phone').setValue(null, [Validators.required])
        } else {
            this.phoneForm.get('phone').setValue(null)
        }
        if(this.value) {
            this.phoneForm.get('phone').setValue(this.value)
        }
    }

    onContactNoChanged() {
        const value: ContactNoOutput = this.phoneForm.value.phone;
        if (this.phoneForm.valid) {
            this.onContactNoUpdate.emit(value);
        } else {
            this.onContactNoUpdate.emit(undefined);
        }
    }

}
