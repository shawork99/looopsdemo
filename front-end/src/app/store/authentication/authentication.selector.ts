import { createFeatureSelector, createSelector } from '@ngrx/store'
import { AuthenticationState } from './authentication.reducer'

export const getUserState =
  createFeatureSelector<AuthenticationState>('authentication')

export const getIsAuthLoading = createSelector(
    getUserState,
    (state: AuthenticationState) => state.isLoading
)

export const getAuthUser = createSelector(
  getUserState,
  (state: AuthenticationState) => state.user
)

export const getIsLoggedIn = createSelector(
    getUserState,
    (state: AuthenticationState) => state.isLoggedIn
)

export const getAuthToken = createSelector(
  getUserState,
  (state: AuthenticationState) => state.token
)

export const getNavigations = createSelector(
  getUserState,
  (state: AuthenticationState) => state.navigation
)

export const getSystemLanguage = createSelector(
    getUserState,
    (state: AuthenticationState) => state.systemLanguage
)

export const selectRecoverPasswordLoading = createSelector(
  getUserState,
  (state) => state.recoverLoading
);

export const selectRecoverPasswordMessage = createSelector(
  getUserState,
  (state) => state.recoverMessage
);

export const selectRecoverPasswordError = createSelector(
  getUserState,
  (state) => state.recoverError
);

// Reset password selectors
export const selectResetPasswordLoading = createSelector(
  getUserState,
  (state: AuthenticationState) => state.resetLoading
);

export const selectResetPasswordMessage = createSelector(
  getUserState,
  (state: AuthenticationState) => state.resetMessage
);

export const selectResetPasswordError = createSelector(
  getUserState,
  (state: AuthenticationState) => state.resetError
);
