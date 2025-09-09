import {createFeatureSelector, createSelector} from "@ngrx/store";
import { CalendarSetupState } from "@store/calendar_steup/calendar_setup.reducer";

export const selectCalendarSetupState = createFeatureSelector<CalendarSetupState>('calendarSetup');
export const selectCalendarSetup = createSelector(
  selectCalendarSetupState,
  (state) => state?.calendarSetup // 👈 this property
);

export const selectCalendarSetupEvents = createSelector(
  selectCalendarSetupState,
  (state) => state?.calendarSetup // should be the array of events
);

export const selectCalendarSetupLoading = createSelector(selectCalendarSetupState,(state) => state.isLoading);
export const selectCalendarSetupError = createSelector(selectCalendarSetupState,(state) => state.error);
export const isCalendarSetupGridLoading = createSelector(selectCalendarSetupState, (state) => state?.isGridLoading);
export const selectShowHideCalendarSetupForm = createSelector(selectCalendarSetupState, (state) => state?.hideCalendarSetupForm);
export const selectShowCalendarSetupFormLoading = createSelector(selectCalendarSetupState, (state) => state?.showFormLoading);
export const selectEditCalendarSetupDetails = createSelector(selectCalendarSetupState, (state) => state?.editCalendarSetupDetails);