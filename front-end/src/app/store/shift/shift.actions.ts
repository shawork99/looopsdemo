import {createAction, props} from "@ngrx/store";
import {Shift, ShiftFilter, ShiftPaginate} from "@store/shift/shift.model";

export const getAllShifts = createAction('[Shift] Get All Shifts', props<{ data: ShiftFilter }>());
export const onGetAllShiftSuccess = createAction('[Shift] Get All Shift Success', props<{ data: ShiftPaginate }>());
export const manageShiftGridLoading = createAction('[Shift] Enable Shift Loading', props<{ data: boolean }>());
export const createShift = createAction('[Shift] Create Shift', props<{ data: Shift }>());
export const updateShift = createAction('[Shift] Update Shift', props<{ shiftId: number, data: Shift }>());
export const deleteShift = createAction('[Shift] Delete Shift', props<{ data: number }>());
export const showHideShiftForm = createAction('[Shift] Show Shift Form', props<{ show: boolean }>());
export const showShiftFormLoading = createAction('[Shift] Show Shift Form Loading', props<{ show: boolean }>());
export const onGetEditShift = createAction('[Shift] Get Edit Shift', props<{ shiftId: number }>());
export const onGetEditShiftSuccess = createAction('[Shift] Get Edit Shift Success', props<{ data: Shift }>());
