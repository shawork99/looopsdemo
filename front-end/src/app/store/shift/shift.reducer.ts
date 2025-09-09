import {createReducer, on} from "@ngrx/store";
import {Shift, ShiftPaginate} from "@store/shift/shift.model";
import {
    getAllShifts,
    manageShiftGridLoading,
    onGetAllShiftSuccess, onGetEditShift, onGetEditShiftSuccess,
    showHideShiftForm, showShiftFormLoading
} from "@store/shift/shift.actions";

export interface ShiftState {
    shifts: ShiftPaginate | null;
    hideShiftForm: boolean,
    isGridLoading: boolean;
    showFormLoading: boolean;
    editShift: Shift;
}

export const initialShiftState: ShiftState = {
    shifts: null,
    hideShiftForm: false,
    isGridLoading: false,
    showFormLoading: false,
    editShift: null
}

export const shiftReducer = createReducer(
    initialShiftState,
    on(getAllShifts, (state) => ({
        ...state,
        isGridLoading: true,
        hideShiftForm: false
    })),
    on(onGetAllShiftSuccess, (state, response) => ({
        ...state,
        shifts: response?.data,
        isGridLoading: false
    })),
    on(showHideShiftForm, (state, status) => ({
        ...state,
        hideShiftForm: status?.show,
        editShift: null,
    })),
    on(manageShiftGridLoading, (state, data) => ({
        ...state,
        isGridLoading: data?.data
    })),
    on(showShiftFormLoading, (state, data) => ({
        ...state,
        showFormLoading: data?.show
    })),
    on(onGetEditShift, (state, data) => ({
        ...state,
        editShift: null,
        showFormLoading: true
    })),
    on(onGetEditShiftSuccess, (state, data) => ({
        ...state,
        editShift: data?.data,
        showFormLoading: false
    }))
)