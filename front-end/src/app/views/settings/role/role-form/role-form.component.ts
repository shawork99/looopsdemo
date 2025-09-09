import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {
    ToggleSwitchComponentComponent
} from "@/app/shared/components/toggle-switch-component/toggle-switch-component.component";
import {CommonModule, NgClass} from "@angular/common";
import {AlertService} from "@/app/services/alert.service";
import {Store} from "@ngrx/store";
import {createRole, showRoleFormLoading, updateRole} from "@store/role/role.actions";
import {Subject, takeUntil} from "rxjs";
import {selectShowHideRoleForm, selectShowRoleFormLoading} from "@store/role/role.selector";
import {Role} from "@store/role/role.model";
import {getIsAuthLoading} from "@store/authentication/authentication.selector";
import {TranslocoPipe} from "@jsverse/transloco";

@Component({
    selector: 'app-role-form',
    imports: [
        FormsModule,
        ReactiveFormsModule,
        ToggleSwitchComponentComponent,
        NgClass,
        CommonModule,
        TranslocoPipe
    ],
    templateUrl: './role-form.component.html',
    styleUrl: './role-form.component.scss'
})
export class RoleFormComponent implements OnDestroy ,OnInit{
    public store = inject(Store)
    submitted = false;
    form: FormGroup = new FormGroup({
        name: new FormControl(null, Validators.required),
        description: new FormControl(null, Validators.required),
        is_active: new FormControl(true, Validators.required),
    });
    editRole: Role;
    private destroy$ = new Subject<void>();
    modalHeader:string;
    isLoading$ = this.store.select(selectShowRoleFormLoading)

    constructor(public modal: NgbActiveModal,
                private alertService: AlertService) {
        this.store.select(selectShowHideRoleForm).pipe(
            takeUntil(this.destroy$)
        ).subscribe((show) => {
            if (!show) {
                this.modal.close()
            }
        });

    }

    ngOnInit(): void {
        if(this.editRole){
            this.form.patchValue(this.editRole);
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
        this.store.dispatch(showRoleFormLoading({show: true}));
        if(this.editRole){
            this.store.dispatch(updateRole({roleId: this.editRole?.id,data: this.form.value}));
        }else {
            this.store.dispatch(createRole({data: this.form.value}));
        }
    }

}
