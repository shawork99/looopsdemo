import {Component, inject, OnInit} from '@angular/core';
import {AsyncPipe, NgClass, NgIf} from "@angular/common";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    ToggleSwitchComponentComponent
} from "@/app/shared/components/toggle-switch-component/toggle-switch-component.component";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {AlertService} from "@/app/services/alert.service";
import {Department} from "@store/department/department.model";
import {selectShowDepartmentFormLoading, selectShowHideDepartmentForm} from "@store/department/department.selector";
import {createDepartment, showDepartmentFormLoading, updateDepartment} from "@store/department/department.actions";
import {TranslocoModule} from "@jsverse/transloco";
import {FormErrorsPipe} from "@/app/shared/pipes/form-errors.pipe";
@Component({
    selector: 'app-departments-form',
    imports: [
        AsyncPipe,
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        NgClass,
        ToggleSwitchComponentComponent,
        TranslocoModule,
        FormErrorsPipe
    ],
    templateUrl: './departments-form.component.html',
    styleUrl: './departments-form.component.scss'
})
export class DepartmentsFormComponent implements OnInit {
    public store = inject(Store);
    submitted = false;
    form: FormGroup = new FormGroup({
        code: new FormControl(null, Validators.required),
        name: new FormControl(null, Validators.required),
        is_active: new FormControl(true, Validators.required),
    });
    editDepartment: Department;
    private destroy$ = new Subject<void>();
    modalHeader: string;
    isLoading$ = this.store.select(selectShowDepartmentFormLoading)

    constructor(public modal: NgbActiveModal,
                private alertService: AlertService) {
        this.store.select(selectShowHideDepartmentForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            if (!show) {
                this.modal.close()
            }
        });

    }

    ngOnInit(): void {
        if (this.editDepartment) {
            this.form.patchValue(this.editDepartment);
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
        this.store.dispatch(showDepartmentFormLoading({show: true}));
        if (this.editDepartment) {
            this.store.dispatch(updateDepartment({departmentId: this.editDepartment?.id, data: this.form.value}));
        } else {
            this.store.dispatch(createDepartment({data: this.form.value}));
        }
    }
}
