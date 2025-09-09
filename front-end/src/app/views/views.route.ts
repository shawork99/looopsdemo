import type {Route} from '@angular/router'
import {IndexComponent} from './dashboards/index/index.component'
import {AnalyticsComponent} from './dashboards/analytics/analytics.component'
import {RoleTableComponent} from "@views/settings/role/role-table/role-table.component";
import {provideState} from "@ngrx/store";
import {roleReducer} from "@store/role/role.reducer";
import {provideEffects} from "@ngrx/effects";
import {RoleEffects} from "@store/role/role.effects";
import {DepartmentsTableComponent} from "@views/settings/departments/departments-table/departments-table.component";
import {departmentReducer} from "@store/department/department.reducer";
import {DepartmentEffects} from "@store/department/department.effects";
import {DesignationTableComponent} from "@views/settings/designation/designation-table/designation-table.component";
import {designationReducer} from "@store/designation/designation.reducer";
import {DesignationEffects} from "@store/designation/designation.effects";
import {NavigationTableComponent} from "@views/settings/navigations/navigation-table/navigation-table.component";
import {navigationReducer} from "@store/navigation/navigation.reducer";
import {NavigationEffects} from "@store/navigation/navigation.effects";
import {UsersTableComponent} from "@views/settings/users/users-table/users-table.component";
import {userReducer} from "@store/users/user.reducer";
import {UserEffects} from "@store/users/user.effects";
import {
    RequestStatusTableComponent
} from "./settings/request-status/request-status-table/request-status-table.component";
import {requestStatusReducer} from "../store/request-status/request-status.reducer";
import {RequestStatusEffects} from "../store/request-status/request-status.effects";
import {
    RequestStatusLayoutComponent
} from "./settings/request-status/request-status-layout/request-status-layout.component";
import {ShiftTableComponent} from "@views/settings/shift/shift-table/shift-table.component";
import {shiftReducer} from "@store/shift/shift.reducer";
import {ShiftEffects} from "@store/shift/shift.effects";
import {LocationsTableComponent} from './settings/locations/locations-table/locations-table.component';
import {locationReducer} from '@store/location/location.reducer';
import {LocationEffects} from '@store/location/location.effects';

import {CustomersTableComponent} from './settings/customers/customers-table/customers-table.component';
import {customerReducer} from '@store/customer/customer.reducer';
import {CustomerEffects} from '@store/customer/customer.effects';

import {LeaveTypeTableComponent} from "@views/settings/leave-type/leave-type-table/leave-type-table.component";
import {leaveTypeReducer} from "@store/leave_type/leave_type.reducer";
import {LeaveTypeEffects} from "@store/leave_type/leave_type.effects";
import {LeaveGroupsTableComponent} from "@views/settings/leave-groups/leave-groups-table/leave-groups-table.component";
import {leaveGroupReducer} from "@store/leave_group/leave_group.reducer";
import {LeaveGroupEffects} from "@store/leave_group/leave_group.effects";

import { ApprovalLevelTableComponent } from '@views/settings/approval-level/approval-level-table/approval-level-table.component';
import { approvalLevelReducer } from '@store/approval-level/approval-level.reducer';
import { ApprovalLevelEffects } from '@store/approval-level/approval-level.effects';

import {CompanyFormComponent} from "./settings/company-configuration/company-form/company-form.component"
import { companyConfigurationReducer } from '@store/company_configuration/company_configuration.reducer';
import { CompanyConfigurationEffects } from '@store/company_configuration/company_configuration.effects';
import { CommonViewComponent } from './common-view/common-view.component';
import { ProfileDetailsComponent } from './myaccount/profile/profile-details/profile-details.component';
import { profileDetailsReducer } from '@store/profile-details/profile_details.reducer';
import { ProfiledetailsEffect } from '@store/profile-details/profile_details.effects';

import { CalendarSetupListComponent } from './settings/calendar-setup/calendar-setup-list/calendar-setup-list.component';
import { calendarSetupReducer } from '@store/calendar_steup/calendar_setup.reducer';
import { CalendarSetupEffects } from '@store/calendar_steup/calendar_setup.effects';

import { LeaveAdjustmentTableComponent } from './leave/leave-adjustment/leave-adjustment-table/leave-adjustment-table.component';
import { LeaveAdjustmentEditFormComponent } from './leave/leave-adjustment/leave-adjustment-edit-form/leave-adjustment-edit-form.component';
import { leaveAdjustmentReducer } from '@store/leave_adjustment/leave_adjustment.reducer';
import { LeaveAdjustmentEffects } from '@store/leave_adjustment/leave_adjustment.effects';

import { SupplierTableComponent } from './settings/suppliers/suppliers-table/supplier-table.component';
import { supplierReducer } from '@store/suppliers/supplier.reducer';
import { SupplierEffects } from '@store/suppliers/supplier.effects';

import { ClockinClockoutComponent } from './myaccount/clockin-clockout/clockin-clockout/clockin-clockout.component';
import { clockinoutReducer } from '@store/clockin-clockout/clockin_clockout.reducer';
import { ClockinoutEffects } from '@store/clockin-clockout/clockin_clockout.effects';

import { AppovalsComponent } from './myaccount/appovals/appovals.component'
import { approvalsReducer } from '@store/approvals/approvals.reducer';
import { ApprovalsEffects } from '@store/approvals/approvals.effects';

import { LeaveApplicationTableComponent } from './myaccount/leave-application/leave-application-table/leave-application-table.component';

export const VIEWS_ROUTES: Route[] = [
    {
        path: 'index',
        component: IndexComponent,
        data: {title: 'Index'},
    },
    {
        path: 'analytics',
        component: AnalyticsComponent,
        data: {title: 'Analytics'},
    },
    {
        path: 'roles',
        component: RoleTableComponent,
        data: {title: 'Roles'},
        providers: [
            provideState('role', roleReducer),
            provideEffects(RoleEffects)
        ]
    },
    {
        path: 'departments',
        component: DepartmentsTableComponent,
        data: {title: 'Departments'},
        providers: [
            provideState('departments', departmentReducer),
            provideEffects(DepartmentEffects)
        ]
    },
    {
        path: 'designation',
        component: DesignationTableComponent,
        data: {title: 'Designation'},
        providers: [
            provideState('designations', designationReducer),
            provideEffects(DesignationEffects)
        ]
    },
    {
        path: 'navigations',
        component: NavigationTableComponent,
        data: {title: 'Navigations'},
        providers: [
            provideState('navigations', navigationReducer),
            provideEffects(NavigationEffects)
        ]
    },
    {
        path: 'users',
        component: UsersTableComponent,
        data: {title: 'User'},
        providers: [
            provideState('users', userReducer),
            provideEffects(UserEffects)
        ]
    },
    {
        path: 'request-status',
        component: RequestStatusLayoutComponent,
        data: {title: 'Request Status'},
        providers: [
            provideState('requestStatus', requestStatusReducer),
            provideEffects(RequestStatusEffects)
        ]
    },
    {
        path: 'shifts',
        component: ShiftTableComponent,
        data: {title: 'Shift'},
        providers: [
            provideState('shifts', shiftReducer),
            provideEffects(ShiftEffects)
        ]
    },
    {
        path: 'locations',
        component: LocationsTableComponent,
        data: {title: 'Locations'},
        providers: [
            provideState('locations', locationReducer),
            provideEffects(LocationEffects),
        ],
    },
    {
        path: 'customers',
        component: CustomersTableComponent,
        data: {title: 'Customers'},
        providers: [
            provideState('customers', customerReducer),
            provideEffects(CustomerEffects),
        ],
    },
    {
        path: 'leave_types',
        component: LeaveTypeTableComponent,
        data: {title: 'Leave Types'},
        providers: [
            provideState('leave_types', leaveTypeReducer),
            provideEffects(LeaveTypeEffects),
        ]
    },
    {
        path: 'leave_groups',
        component: LeaveGroupsTableComponent,
        data: {title: 'Leave Groups'},
        providers: [
            provideState('leave_groups', leaveGroupReducer),
            provideEffects(LeaveGroupEffects),
        ]
    },
    {
        path: 'approval_levels',
        component: ApprovalLevelTableComponent,
        data: {title: 'Approval Levels'},
        providers: [
            provideState('approvalLevel', approvalLevelReducer),
            provideEffects(ApprovalLevelEffects),
        ]
    },
    {
        path: 'company-configuration',
        component: CompanyFormComponent,
        data: { title: 'Company Configuration' },
        providers: [
            provideState('company_configuration',companyConfigurationReducer ),
            provideEffects(CompanyConfigurationEffects),
        ],
    },
    {
        path: 'profile',
        component: ProfileDetailsComponent,
        data: { title: 'Profile' },
          providers: [
            provideState('profile', profileDetailsReducer),
            provideEffects(ProfiledetailsEffect),
            ],
    },
    {
    path: 'in-out',
    component: ClockinClockoutComponent,
    data: { title: 'In / Out' },
    providers: [
        provideState('in-out', clockinoutReducer),
        provideEffects(ClockinoutEffects),
    ],
    },

    {
        path:'profile-leave',
        component: LeaveApplicationTableComponent,
        data: {title: 'Leave Application'},
        providers: []
    },
    {
        path: 'day-attendence',
        component: CommonViewComponent,
        data: { title: 'Day Attendance' }
    },
    {
        path: 'attendance-history',
        component: CommonViewComponent,
        data: { title: 'Attendance History' }
    },
    {
        path: 'attendance-summary',
        component: CommonViewComponent,
        data: { title: 'Attendance Summary' }
    },
    {
        path: 'leaves',
        component: CommonViewComponent,
        data: { title: 'Leaves' }
    },
    {
        path: 'leave_adjustment',
        component: LeaveAdjustmentTableComponent,
        data: { title: 'Leave Adjustment' },
        providers: [
            provideState('leaveAdjustment', leaveAdjustmentReducer),
            provideEffects(LeaveAdjustmentEffects),
        ]
    },
    {
        path: 'leave_adjustment/edit/:id',
        component: LeaveAdjustmentEditFormComponent,
        data: {title: 'Leave Adjustment Edit'},
        providers: [
            provideState('leaveAdjustment', leaveAdjustmentReducer),
            provideEffects(LeaveAdjustmentEffects)
        ]
    },
    {
        path: 'leave_report',
        component: CommonViewComponent,
        data: { title: 'Leave Report'}
    },
    {
        path: 'calendar_setup',
        component: CalendarSetupListComponent,
        data: { title: 'Calendar Setup'},
        providers: [
            provideState('calendarSetup', calendarSetupReducer),
            provideEffects(CalendarSetupEffects)
        ]
    },
    {
        path: 'suppliers',
        component: SupplierTableComponent,
        data: { title: 'Suppliers' },
        providers: [
            provideState('suppliers', supplierReducer),
            provideEffects(SupplierEffects)
        ]
    },
    {
        path: 'approvals',
        component: AppovalsComponent,
        data: { title: 'Approvals' },
        providers: [
            provideState('approvals', approvalsReducer),
            provideEffects(ApprovalsEffects)
        ]
    }


]
