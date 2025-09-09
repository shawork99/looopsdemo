import {createReducer, on} from "@ngrx/store";
import * as DepartmentActions from "./department.actions";
import {DepartmentPaginate} from "@store/department/department.model";

export interface DepartmentState {
    departments : DepartmentPaginate | null;
    hideDepartmentForm:boolean,
    isGridLoading:boolean;
    showFormLoading:boolean;
}

export const initialDepartmentState: DepartmentState = {
    departments: null,
    hideDepartmentForm: false,
    isGridLoading : false,
    showFormLoading: false
}

export const departmentReducer = createReducer(
    initialDepartmentState,
    on(DepartmentActions.getAllDepartments,(state) =>({
        ...state,
        isGridLoading: true,
        hideDepartmentForm: false
    })),
    on(DepartmentActions.onAllDepartmentSuccess,(state,response) =>({
        ...state,
        departments:response?.data,
        isGridLoading: false
    })),
    on(DepartmentActions.showHideDepartmentForm,(state,status) =>({
        ...state,
        hideDepartmentForm: status?.show
    })),
    on(DepartmentActions.manageDepartmentGridLoading,(state,data) =>({
        ...state,
        isGridLoading: data?.data
    })),
    on(DepartmentActions.showDepartmentFormLoading,(state,data) =>({
        ...state,
        showFormLoading: data?.show
    }))
)