import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass, NgForOf} from "@angular/common";
import {HttpClient} from "@angular/common/http";

export type CountryPicker = {
    englishShortName: string;
    frenchShortName: string;
    alpha2Code: string;
    alpha3Code: string;
    numeric: number;
};

@Component({
    selector: 'app-country-picker',
    encapsulation: ViewEncapsulation.None,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        NgClass,
        NgForOf,
    ],
    template: `
        <ng-container [formGroup]="countryForm">
            <select [ngClass]="{'is-invalid' : countryForm.get('country')?.invalid && (  countryForm.get('country')?.touched) && required}"
                    class="datatable-selector form-select"
                    name="country"
                    id="country"
                    (change)="onCountryChanges()"
                    formControlName="country">
                <option *ngFor="let country of countryList"
                        value="{{country?.englishShortName}}">{{ country?.englishShortName }}
                    - {{ country?.alpha2Code }}
                </option>
            </select>
        </ng-container>
    `,
    styleUrl: './country-picker.component.scss'
})
export class CountryPickerComponent {
    @Input() required: boolean = false;
    @Input() value: boolean = false;
    @Output() onCountryUpdate: EventEmitter<CountryPicker> = new EventEmitter<CountryPicker>();
    countryForm = new FormGroup({
        country: new FormControl(null, [Validators.required])
    });
    countryList: CountryPicker[] = [];

    constructor(private http: HttpClient) {
    }

    ngOnInit() {
        this.http.get<any[]>('/assets/json/country-list.json')
            .subscribe((response: CountryPicker[]) => {
                this.countryList = response;
            });
        console.log('this.value',this.value)
        if (this.value) {

            this.countryForm.get('country').setValue(this.value || undefined);
        }
    }

    onCountryChanges() {
        this.onCountryUpdate.emit(this.countryForm.value?.country);
    }

}
