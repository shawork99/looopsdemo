import { createReducer, on } from "@ngrx/store";
import * as ProfileActions from "./profile_details.action";
import { profile } from "./profile_details.model";

export interface ProfileDetailsState {
  profile: profile | null;
  loading: boolean;
  error: any;
}

export const initialProfileDetailsState: ProfileDetailsState = {
  profile: null,
  loading: false,
  error: null,
};

export const profileDetailsReducer = createReducer(
  initialProfileDetailsState,
  on(ProfileActions.loadProfileDetails, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(ProfileActions.loadProfileDetailsSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
  })),
  on(ProfileActions.loadProfileDetailsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ProfileActions.updatePasswordFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(ProfileActions.updatePasswordSuccess, (state) => ({
    ...state,
    error: null,
  }))
);
