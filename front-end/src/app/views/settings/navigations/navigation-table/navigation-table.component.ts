import {Component, inject, OnDestroy} from '@angular/core';
import {BreadcrumbComponent} from "@components/breadcrumb/breadcrumb.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {Store} from "@ngrx/store";
import {Subject, takeUntil} from "rxjs";
import {
    isNavigationGridLoading, isNavigationPermissionLoading, isSaveButtonLoading,
    selectNavigationFormData,
    selectNavigationWithRole
} from "@store/navigation/navigation.selector";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {
    createNavigationByRole,
    getNavigationByRoleId,
    getNavigationFormData, onRestNavigationState, showSaveButtonLoading
} from "@store/navigation/navigation.actions";
import {GetNavigationsByRole, NavigationFormData} from "@store/navigation/navigation.model";
import {AlertService} from "@/app/services/alert.service";

@Component({
    selector: 'app-navigation-table',
    imports: [
        BreadcrumbComponent,
        ReactiveFormsModule,
        FormsModule,
        NgIf,
        NgForOf,
        AsyncPipe
    ],
    templateUrl: './navigation-table.component.html',
    styleUrl: './navigation-table.component.scss'
})
export class NavigationTableComponent implements OnDestroy {
    public store = inject(Store)
    selectedRoleId: number;
    isLoading: boolean;
    isNavigationPermissionGridLoading: boolean;
    private destroy$ = new Subject<void>();
    formData: NavigationFormData;
    navigationWithRole: GetNavigationsByRole;
    navigations: any[] = [];
    isSaveButtonLoading$ = this.store.select(isSaveButtonLoading);

    constructor(private alertService: AlertService) {
        this.store.dispatch(onRestNavigationState());
        this.store.select(isNavigationGridLoading).pipe(
            takeUntil(this.destroy$)
        ).subscribe(loading => {
            this.isLoading = loading;
        });
        this.store.select(selectNavigationFormData).pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: NavigationFormData) => {
            this.formData = data;
        });
        this.store.select(isNavigationPermissionLoading).pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: boolean) => {
            this.isNavigationPermissionGridLoading = data;
        });
        this.store.select(selectNavigationWithRole).pipe(
            takeUntil(this.destroy$)
        ).subscribe((data: GetNavigationsByRole) => {
            this.initNavigationForm(data);
            console.log(this.navigationWithRole);
        });
        this.getFormData();
    }

    initNavigationForm(data: GetNavigationsByRole) {
        this.navigationWithRole = data;
        this.navigations = [];
        this.navigationWithRole?.navigations?.forEach(navigation => {
            const navRow: any = {
                key: navigation?.key,
                label: navigation?.label,
                isSelected: false,
                children: []
            }
            if (navigation?.children?.length > 0) {
                navigation?.children?.forEach(child => {
                    const childNavContent: any = {
                        key: child?.key,
                        label: child?.label,
                        isSelected: false,
                        permissions: []
                    }
                    const permissions: any[] = data?.permissions?.filter(permission => permission.key === child?.key);
                    permissions?.forEach(p => {
                        const isSelected = data?.role?.permissions?.includes(p?.permission_name);
                        childNavContent?.permissions.push({
                            label: p?.label,
                            key: p?.key,
                            permission_name: p?.permission_name,
                            isSelected: isSelected,
                        });
                        if (isSelected) {
                            childNavContent.isSelected = true;
                        }
                    });
                    if (childNavContent?.isSelected) {
                        navRow.isSelected = true;
                    }
                    navRow.children.push(childNavContent);
                });
                this.navigations.push(navRow);
            }
        });
    }

    getFormData() {
        this.store.dispatch(getNavigationFormData());
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onRoleIdChanged() {
        this.store.dispatch(showSaveButtonLoading({show: true}));
        this.store.dispatch(getNavigationByRoleId({
            roleId: this.selectedRoleId
        }));
    }

    onMainNavSelected(mainNav: any, event: any) {
        mainNav.isSelected = event;
        this.selectChild(mainNav, event);
    }

    onSubNavSelected(mainNav: any, subNav: any, event: any) {
        subNav.isSelected = event;
        this.selectChild(subNav, event);
        this.reprocessMainNav(mainNav);
    }

    onPermissionSelected(mainNav: any, subNav: any, permission: any, event: any) {
        permission.isSelected = event;
        this.reprocessSubNav(subNav);
        this.reprocessMainNav(mainNav);
    }

    reprocessMainNav(mainNav: any) {
        mainNav.isSelected = false;
        mainNav?.children?.forEach((child: any) => {
            if (child.isSelected) {
                mainNav.isSelected = true;
            }
        });
    }

    reprocessSubNav(subNav: any) {
        subNav.isSelected = false;
        subNav?.permissions?.forEach((permission: any) => {
            if (permission.isSelected) {
                subNav.isSelected = true;
            }
        });
    }

    private selectChild(item: any, event: any) {
        if (item?.children?.length > 0) {
            item?.children?.forEach((child: any) => {
                child.isSelected = event;
                this.selectChild(child, event)
            })
        }
        if (item?.permissions?.length > 0) {
            item?.permissions?.forEach((permission: any) => {
                permission.isSelected = event;
            });
        }
    }

    onSave() {
        if (this.navigations?.length > 0) {
            const selectedNavKeys: any[] = [];
            const selectedPermissionKeys: any[] = [];
            this.navigations?.forEach(nav => {
                if (nav?.isSelected) {
                    selectedNavKeys.push(nav?.key);
                }
                nav.children?.forEach((child: any) => {
                    if (child?.isSelected) {
                        selectedNavKeys.push(child?.key);
                    }
                    child?.permissions?.forEach((permission: any) => {
                        if (permission?.isSelected) {
                            selectedPermissionKeys.push(permission?.permission_name);
                        }
                    });
                })
            });
            if (selectedNavKeys?.length === 0) {
                this.alertService.showError("Please select at least one navigation");
                return;
            }
            if (selectedPermissionKeys?.length === 0) {
                this.alertService.showError("Please select at least one permission");
                return;
            }

            this.store.dispatch(showSaveButtonLoading({show: true}));
            this.store.dispatch(createNavigationByRole({
                data: {
                    roleId: this.selectedRoleId,
                    navigationKeys: selectedNavKeys,
                    permissionKeys: selectedPermissionKeys
                }
            }));
        } else {
            this.alertService.showError("Please select at least one navigation");
        }
    }
}