import { createReducer, on } from '@ngrx/store';
import { ClockinoutState } from './clockin_clockout.model';
import * as ClockinoutActions from './clockin_clockout.action';
export type { ClockinoutState } from './clockin_clockout.model';

export const initialState: ClockinoutState = {
 clockinclockout: null,
  loadprofiledata: null,
  loadattandacestatus: [], 
  loadallinandoutdata: [], 
  clockinoutDetails: [], 
  otherCelebrantsMessage: null,
  userMessage: null,
  isLoading: false,
  error: null,
  wishesLoading: false,
  wishesError: null,
};

export const clockinoutReducer = createReducer(
  initialState,

  on(ClockinoutActions.loadprfiledata, (state) => ({
    ...state,
    isLoading: true
  })), 

  on(ClockinoutActions.loadprfiledataSuccess, (state, { data }) => ({
    ...state,
    loadprofiledata: data,
    isLoading: false
  })),

  on(ClockinoutActions.loadprfiledataFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(ClockinoutActions.loadClockinoutDetails, (state) => ({
    ...state,
    isLoading: true,
  })),

  on(ClockinoutActions.loadClockinoutDetailsSuccess, (state, { data }) => ({
    ...state,
    clockinoutDetails: data,
    isLoading: false,
  })),

  on(ClockinoutActions.loadClockinoutDetailsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  on(ClockinoutActions.loadattandacestsatus, (state) => ({
    ...state,
    isLoading: true
  })),

  on(ClockinoutActions.loadattandacestsatusSuccess, (state, { data }) => ({
    ...state,
    loadattandacestatus: data,
    isLoading: false
  })),

  on(ClockinoutActions.loadattandacestsatusFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),


  on(ClockinoutActions.loadallinandout, (state) => ({
    ...state,
    isLoading: true
  })),

  on(ClockinoutActions.loadallinandoutSuccess, (state, { data }) => ({
    ...state,
    loadallinandoutdata: data,
    isLoading: false
  })),

  on(ClockinoutActions.loadallinandoutFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),
  on(ClockinoutActions.loadWishes, (state) => ({ ...state, wishesLoading: true })),
  on(ClockinoutActions.loadWishesSuccess, (state, { userMessage, otherCelebrantsMessage }) => ({
    ...state,
    userMessage,
    otherCelebrantsMessage,
    wishesLoading: false,
    wishesError: null as any,
  })),
  on(ClockinoutActions.loadWishesFailure, (state, { error }) => ({
    ...state,
    wishesLoading: false,
    wishesError: error,
  }))



);

