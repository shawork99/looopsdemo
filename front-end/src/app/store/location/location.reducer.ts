import { createReducer, on } from "@ngrx/store";
import * as LocationActions from "./location.actions";
import { LocationPaginate } from "./location.model";

export interface LocationState {
  locations: LocationPaginate | null;
  hideLocationForm: boolean;
  isGridLoading: boolean;
  showFormLoading: boolean;
}

export const initialLocationState: LocationState = {
  locations: null,
  hideLocationForm: false,
  isGridLoading: false,
  showFormLoading: false,
};

export const locationReducer = createReducer(
  initialLocationState,

  on(LocationActions.getAllLocations, (state) => ({
    ...state,
    isGridLoading: true,
    hideLocationForm: false,
  })),

  on(LocationActions.onAllLocationSuccess, (state, response) => ({
    ...state,
    locations: response.data,
    isGridLoading: false,
  })),

  on(LocationActions.manageLocationGridLoading, (state, data) => ({
    ...state,
    isGridLoading: data.data,
  })),

  on(LocationActions.showHideLocationForm, (state, status) => ({
    ...state,
    hideLocationForm: status.show,
  })),

  on(LocationActions.showLocationFormLoading, (state, data) => ({
    ...state,
    showFormLoading: data.show,
  }))
);
