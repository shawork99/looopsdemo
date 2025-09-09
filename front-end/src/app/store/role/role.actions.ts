import {Role, RoleFilter, RolePaginate} from "@store/role/role.model";
import {createAction, props} from "@ngrx/store";


export const getAllRoles = createAction('[Role] Get All Roles',props<{data:RoleFilter}>());
export const onAllRolesSuccess = createAction('[Role] Get All Roles Success',props<{data:RolePaginate}>());
export const manageRoleLoading = createAction('[Role] Enable Role Loading',props<{data:boolean}>());
export const createRole = createAction('[Role] Create Role',props<{data:Role}>());
export const updateRole = createAction('[Role] Update Role',props<{roleId: number,data:Role}>());
export const deleteRole = createAction('[Role] Delete Role',props<{data:number}>());
export const showHideRoleForm = createAction('[Role] Show Role Form',props<{show:boolean}>());
export const showRoleFormLoading = createAction('[Role] Show Role Form Loading',props<{show:boolean}>());
