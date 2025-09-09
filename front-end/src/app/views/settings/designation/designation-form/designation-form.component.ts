import {Component, inject} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    ToggleSwitchComponentComponent
} from "@/app/shared/components/toggle-switch-component/toggle-switch-component.component";
import {TranslocoPipe} from "@jsverse/transloco";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {Designation} from "@store/designation/designation.model";
import {createDesignation, showDesignationFormLoading, updateDesignation} from "@store/designation/designation.actions";
import {selectShowDesignationFormLoading, selectShowHideDesignationForm} from "@store/designation/designation.selector";

@Component({
  selector: 'app-designation-form',
    imports: [
        AsyncPipe,
        NgIf,
        ReactiveFormsModule,
        ToggleSwitchComponentComponent,
        TranslocoPipe,
        NgClass
    ],
  templateUrl: './designation-form.component.html',
  styleUrl: './designation-form.component.scss'
})
export class DesignationFormComponent {

    public store = inject(Store);
    submitted = false;
    form: FormGroup = new FormGroup({
        title: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        is_active: new FormControl(true, Validators.required),
    });
    editDesignation: Designation;
    private destroy$ = new Subject<void>();
    modalHeader: string;
    isLoading$ = this.store.select(selectShowDesignationFormLoading)

    constructor(public modal: NgbActiveModal,
                private alertService: AlertService) {
        this.store.select(selectShowHideDesignationForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            if (!show) {
                this.modal.close()
            }
        });

    }

    ngOnInit(): void {
        if (this.editDesignation) {
            this.form.patchValue(this.editDesignation);
        }
    }

    onStatusChange(event: any) {
        this.form.patchValue({is_active: event});

    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSubmit() {
        this.submitted = true;
        if (this.form.invalid) {
            this.alertService.showError("Please fill all the required fields");
            return;
        }
        this.store.dispatch(showDesignationFormLoading({show: true}));
        if (this.editDesignation) {
            this.store.dispatch(updateDesignation({designationId: this.editDesignation?.id, data: this.form.value}));
        } else {
            this.store.dispatch(createDesignation({data: this.form.value}));
        }
    }
}
