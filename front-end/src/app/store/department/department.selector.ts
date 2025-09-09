import {createFeatureSelector, createSelector} from "@ngrx/store";
import {DepartmentState} from "@store/department/department.reducer";

export const selectDepartmentState = createFeatureSelector<DepartmentState>('departments');
export const selectDepartments = createSelector(selectDepartmentState, (state) => state?.departments);
export const isDepartmentsGridLoading = createSelector(selectDepartmentState, (state) => state?.isGridLoading);
export const selectShowHideDepartmentForm = createSelector(selectDepartmentState, (state) => state?.hideDepartmentForm);
export const selectShowDepartmentFormLoading = createSelector(selectDepartmentState, (state) => state?.showFormLoading);