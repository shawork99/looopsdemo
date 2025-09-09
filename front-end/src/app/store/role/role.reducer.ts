import {createReducer, on} from "@ngrx/store";
import * as RoleActions from "./role.actions";
import {Role, RolePaginate} from "@store/role/role.model";

export interface RoleState {
    roles : RolePaginate | null;
    hideRoleForm:boolean,
    editRole:Role | null;
    isGridLoading:boolean;
    showFormLoading:boolean;
}

export const initialRoleState: RoleState = {
    roles: null,
    hideRoleForm: false,
    editRole: null,
    isGridLoading : false,
    showFormLoading: false
}

export const roleReducer = createReducer(
    initialRoleState,
    on(RoleActions.getAllRoles,(state) =>({
        ...state,
        isGridLoading: true,
        hideRoleForm: false
    })),
    on(RoleActions.onAllRolesSuccess,(state,response) =>({
        ...state,
        roles:response?.data,
        isGridLoading: false
    })),
    on(RoleActions.showHideRoleForm,(state,status) =>({
        ...state,
        hideRoleForm: status?.show
    })),
    on(RoleActions.showRoleFormLoading,(state,data) =>({
        ...state,
        showFormLoading: data?.show
    }))
)