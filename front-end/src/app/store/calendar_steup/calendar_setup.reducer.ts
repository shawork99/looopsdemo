import {createReducer, on} from "@ngrx/store";
import * as CalendarSetupAction from "./calendar_setup.actions";
import { CalendarSetup, CalendarSetupEvent } from "@store/calendar_steup/calendar_setup.model";


export interface CalendarSetupState {
    calendarSetup: CalendarSetupEvent[];
    isLoading: boolean;
    error?: string;
    hideCalendarSetupForm: boolean,
    isGridLoading: boolean;
    showFormLoading: boolean;
    editCalendarSetupDetails: CalendarSetup;
}

export const initialCalendarSetupState: CalendarSetupState = {
    calendarSetup: [],
    isLoading: false,
    error: null,
    hideCalendarSetupForm: false,
    isGridLoading: false,
    showFormLoading: false,
    editCalendarSetupDetails: null
}

export const calendarSetupReducer = createReducer(
    initialCalendarSetupState,
    on(CalendarSetupAction.loadCalendarSetupEvents, (state) => ({
        ...state,
        isLoading: true,
        error: undefined
    })),
    on(CalendarSetupAction.loadCalendarSetupEventsSuccess, (state, { events }) => ({
        ...state,
        calendarSetup: events
    })),
    on(CalendarSetupAction.loadCalendarSetupEventsFailure, (state, { error }) => ({
        ...state,
        isLoading: false,
        error
    })),
    on(CalendarSetupAction.showHideCalendarSetupForm, (state, status) => ({
        ...state,
        hideCalendarSetupForm: status?.show,
        editCalendarSetupDetails: null
    })),
    on(CalendarSetupAction.manageCalendarSetupLoading, (state, data) => ({
        ...state,
        isGridLoading: data?.data
    })),
    on(CalendarSetupAction.onEditCalendarSetupDetailSuccess, (state, data) => ({
        ...state,
        editCalendarSetupDetails: data?.data,
        showFormLoading: false
    })),
    on(CalendarSetupAction.getEditCalendarSetupDetails, (state, data) => ({
        ...state,
        showFormLoading: true
    }))

)