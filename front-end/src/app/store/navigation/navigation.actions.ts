import {createAction, props} from "@ngrx/store";
import {
    CreateNavigationRequest,
    GetNavigationsByRole,
    NavigationFormData
} from "@store/navigation/navigation.model";

export const getNavigationFormData = createAction('[Navigation] Get Navigation Formdata');
export const onNavigationFormDataSuccess = createAction('[Navigation] Navigation Formdata Success', props<{
    data: NavigationFormData
}>());
export const onRestNavigationState = createAction('[Navigation] Navigation Rest Navigation State');

export const manageNavigationGridLoading = createAction('[Navigation] Navigation Grid Loading', props<{
    show: boolean
}>());

export const manageNavigationPermissionLoading = createAction('[Navigation] Navigation Permission Loading', props<{
    show: boolean
}>());

export const getNavigationByRoleId = createAction('[Navigation] Get Navigation By Role Id', props<{
    roleId: number
}>());

export const onNavigationByRoleIdSuccess = createAction('[Navigation] Get Navigation By Role Id Success', props<{
    data: GetNavigationsByRole
}>());

export const createNavigationByRole = createAction('[Navigation] Create Navigation By Role', props<{
    data: CreateNavigationRequest
}>());

export const showSaveButtonLoading = createAction('[Navigation] Show Save Button Loading', props<{
    show: boolean
}>());