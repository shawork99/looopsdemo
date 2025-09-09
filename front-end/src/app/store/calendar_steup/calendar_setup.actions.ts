import { createAction, props } from '@ngrx/store';
import {
    CalendarSetup, CalendarSetupEvent
} from '@store/calendar_steup/calendar_setup.model';


export const loadCalendarSetupEvents = createAction('[CalendarSetup] Load Events');
export const loadCalendarSetupEventsSuccess = createAction(
  '[CalendarSetup] Load Events Success',
  props<{ events: CalendarSetupEvent[] }>()
);
export const loadCalendarSetupEventsFailure = createAction(
  '[CalendarSetup] Load Events Failure',
  props<{ error: string }>()
);


export const manageCalendarSetupLoading = createAction(
    '[CalendarSetup] Enable Calendar Setup Loading',
    props<{ data: boolean }>()
);
export const createCalendarSetup = createAction(
    '[CalendarSetup] Create Calendar Setup',
    props<{ data: CalendarSetup }>()
);
export const updateCalendarSetup = createAction(
    '[CalendarSetup] Update Calendar Setup',
    props<{ calendarSetupId: number; data: CalendarSetup }>()
);
export const deleteCalendarSetup = createAction(
    '[CalendarSetup] Delete Calendar Setup',
    props<{ data: number }>()
);
export const showHideCalendarSetupForm = createAction(
    '[CalendarSetup] Show CalendarSetup Form',
    props<{ show: boolean }>()
);
export const showCalendarSetupFormLoading = createAction(
    '[CalendarSetup] Show Calendar Setup Form Loading',
    props<{ show: boolean }>()
);
export const getEditCalendarSetupDetails = createAction(
    '[CalendarSetup] Get Edit Calendar Setup Details',
     props<{ calendarSetupId: number }>()
);
export const onEditCalendarSetupDetailSuccess = createAction(
    '[CalendarSetup] On Edit Calendar Setup Details Success',
    props<{ data: CalendarSetup }>()
);
