import { createAction, props } from '@ngrx/store';
import { clockinclockout,clockinrespons,clockoutrespons , load_profile, load_clockinoutprfile } from './clockin_clockout.model';

export const loadprfiledata = createAction(
  '[clockinclockout] Get User Data',
  props<{ load_profile: any }>()
);
export const loadprfiledataSuccess = createAction(
  '[clockinclockout] Get All User Data Success',
  props<{ data: load_profile }>()
);
export const loadprfiledataFailure = createAction(
  '[clockinclockout] Load User Data Failure',
  props<{ error: any }>()
);

export const clockIn = createAction(
  '[ClockInClockOut] Clock In',
  props<{ userId: number; comment: string }>()
);
export const clockInSuccess = createAction(
  '[clockinrespons] Clock In Success',
  props<{ data: any }>()
);
export const clockInFailure = createAction(
  '[clockinrespons] Clock In Failure',
  props<{ error: any }>()
);

export const clockOut = createAction(
  '[ClockInClockOut] Clock Out',
  props<{ userId: number; comment: string }>()
);
export const clockOutSuccess = createAction(
  '[clockoutrespons] Clock Out Success',
  props<{ data: any }>()
);
export const clockOutFailure = createAction(
  '[clockoutrespons] Clock Out Failure',
  props<{ error: any }>()
);

export const loadClockinoutDetails = createAction(
  '[ClockInClockOut] Load ClockInOut Details'
);

export const loadClockinoutDetailsSuccess = createAction(
  '[ClockInClockOut] Load ClockInOut Details Success',
  props<{ data: any }>()
);

export const loadClockinoutDetailsFailure = createAction(
  '[ClockInClockOut] Load ClockInOut Details Failure',
  props<{ error: any }>()
);


export const loadattandacestsatus = createAction(
  '[ClockInClockOut] Load Attandance Status Details'
);

export const loadattandacestsatusSuccess = createAction(
  '[ClockInClockOut] Load Attandance Status Details Success',
  props<{ data: any }>()
);

export const loadattandacestsatusFailure = createAction(
  '[ClockInClockOut] Load Attandance Status Details Failure',
  props<{ error: any }>()
);


export const loadallinandout = createAction(
  '[ClockInClockOut] Load All Clockin and out Details'
);

export const loadallinandoutSuccess = createAction(
  '[ClockInClockOut] Load All Clockin and out Details Success',
  props<{ data: any }>()
);

export const loadallinandoutFailure = createAction(
  '[ClockInClockOut] Load All Clockin and out Details Failure',
  props<{ error: any }>()
);

export const loadWishes = createAction('[ClockinClockout] Load Wishes');

export const loadWishesSuccess = createAction(
  '[ClockinClockout] Load Wishes Success',
  props<{ userMessage: string | null; otherCelebrantsMessage: string | null }>()
);
export const loadWishesFailure = createAction(
  '[ClockinClockout] Load Wishes Failure',
  props<{ error: any }>()
);
