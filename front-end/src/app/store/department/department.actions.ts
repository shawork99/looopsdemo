import {createAction, props} from "@ngrx/store";
import {Department, DepartmentFilter, DepartmentPaginate} from "@store/department/department.model";


export const getAllDepartments = createAction('[Department] Get All Departments',props<{data:DepartmentFilter}>());
export const onAllDepartmentSuccess = createAction('[Department] Get All Departments Success',props<{data:DepartmentPaginate}>());
export const manageDepartmentGridLoading = createAction('[Department] Enable Departments Loading',props<{data:boolean}>());
export const createDepartment = createAction('[Department] Create Departments',props<{data:Department}>());
export const updateDepartment = createAction('[Department] Update Departments',props<{departmentId: number,data:Department}>());
export const deleteDepartment = createAction('[Department] Delete Departments',props<{data:number}>());
export const showHideDepartmentForm = createAction('[Department] Show Department Form',props<{show:boolean}>());
export const showDepartmentFormLoading = createAction('[Department] Show Department Form Loading',props<{show:boolean}>());
