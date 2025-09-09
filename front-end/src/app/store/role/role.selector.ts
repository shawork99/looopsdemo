import {createFeatureSelector, createSelector} from "@ngrx/store";
import {RoleState} from "@store/role/role.reducer";

export const selectRoleState = createFeatureSelector<RoleState>('role');
export const selectRoles = createSelector(selectRoleState, (state) => state?.roles);
export const isRolesGridLoading = createSelector(selectRoleState, (state) => state?.isGridLoading);
export const selectShowHideRoleForm = createSelector(selectRoleState, (state) => state?.hideRoleForm);
export const selectShowRoleFormLoading = createSelector(selectRoleState, (state) => state?.showFormLoading);