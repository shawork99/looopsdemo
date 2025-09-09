import {createFeatureSelector, createSelector} from "@ngrx/store";
import {UserState} from "@store/users/user.reducer";

export const selectUserState = createFeatureSelector<UserState>('users');
export const selectUsers = createSelector(selectUserState, (state) => state?.users);
export const isUsersGridLoading = createSelector(selectUserState, (state) => state?.isGridLoading);
export const selectShowHideUserForm = createSelector(selectUserState, (state) => state?.hideUserForm);
export const selectShowUserFormLoading = createSelector(selectUserState, (state) => state?.showFormLoading);
export const selectUserFormData = createSelector(selectUserState, (state) => state?.formData);
export const selectEditUserDetails = createSelector(selectUserState, (state) => state?.editUserDetails);
export const selectShowHidePasswordResetForm = createSelector(selectUserState, (state) => state?.showPasswordResetForm);
export const selectSendMailLoading = createSelector(selectUserState,(state) => state.loading);
export const selectIsExcelDownloading = createSelector(
  selectUserState,
  (state) => state.isExcelDownloading
);
