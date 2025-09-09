import * as DesignationActions from "./designation.actions";
import {DesignationPaginate} from "@store/designation/designation.model";
import {createReducer, on} from "@ngrx/store";

export interface DesignationState {
    designations : DesignationPaginate | null;
    hideDesignationForm:boolean,
    isGridLoading:boolean;
    showFormLoading:boolean;
}

export const initialDesignationState: DesignationState = {
    designations: null,
    hideDesignationForm: false,
    isGridLoading : false,
    showFormLoading: false
}

export const designationReducer = createReducer(
    initialDesignationState,
    on(DesignationActions.getAllDesignation,(state) =>({
        ...state,
        isGridLoading: true,
        hideDesignationForm: false
    })),
    on(DesignationActions.onAllDesignationSuccess,(state,response) =>({
        ...state,
        designations:response?.data,
        isGridLoading: false
    })),
    on(DesignationActions.showHideDesignationForm,(state,status) =>({
        ...state,
        hideDesignationForm: status?.show
    })),
    on(DesignationActions.manageDesignationGridLoading,(state,data) =>({
        ...state,
        isGridLoading: data?.data
    })),
    on(DesignationActions.showDesignationFormLoading,(state,data) =>({
        ...state,
        showFormLoading: data?.show
    }))
)