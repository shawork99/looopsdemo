import {createAction, props} from "@ngrx/store";
import {Designation, DesignationFilter, DesignationPaginate} from "@store/designation/designation.model";


export const getAllDesignation = createAction('[Designation] Get All Designation',props<{data:DesignationFilter}>());
export const onAllDesignationSuccess = createAction('[Designation] Get All Designation Success',props<{data:DesignationPaginate}>());
export const manageDesignationGridLoading = createAction('[Designation] Manage Designation Grid Loading',props<{data:boolean}>());
export const createDesignation = createAction('[Designation] Create Designation',props<{data:Designation}>());
export const updateDesignation = createAction('[Designation] Update Designation',props<{designationId: number,data:Designation}>());
export const deleteDesignation = createAction('[Designation] Delete Designation',props<{data:number}>());
export const showHideDesignationForm = createAction('[Designation] Show Designation Form',props<{show:boolean}>());
export const showDesignationFormLoading = createAction('[Designation] Show Designation Form Loading',props<{show:boolean}>());
