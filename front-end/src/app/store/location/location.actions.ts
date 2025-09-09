import { createAction, props } from "@ngrx/store";
import { Location, LocationFilter, LocationPaginate } from "./location.model";

export const getAllLocations = createAction('[Location] Get All Locations', props<{ data: LocationFilter }>());
export const onAllLocationSuccess = createAction('[Location] Get All Locations Success', props<{ data: LocationPaginate }>());
export const manageLocationGridLoading = createAction('[Location] Enable Locations Loading', props<{ data: boolean }>());

export const createLocation = createAction('[Location] Create Location', props<{ data: Location }>());
export const updateLocation = createAction('[Location] Update Location', props<{ locationId: number, data: Location }>());
export const deleteLocation = createAction('[Location] Delete Location', props<{ data: number }>());

export const showHideLocationForm = createAction('[Location] Show Location Form', props<{ show: boolean }>());
export const showLocationFormLoading = createAction('[Location] Show Location Form Loading', props<{ show: boolean }>());
