import {createFeatureSelector, createSelector} from "@ngrx/store";
import {NavigationState} from "@store/navigation/navigation.reducer";

export const getNavigationState =
    createFeatureSelector<NavigationState>('navigations')

export const selectNavigationFormData = createSelector(
    getNavigationState,
    (state: NavigationState) => state.navigationFormData
)

export const selectNavigationWithRole = createSelector(
    getNavigationState,
    (state: NavigationState) => state.navigationWithRole
)

export const isNavigationGridLoading = createSelector(
    getNavigationState,
    (state: NavigationState) => state.isGridLoading
)

export const isNavigationPermissionLoading = createSelector(
    getNavigationState,
    (state: NavigationState) => state.isNavigationPermissionLoading
)

export const isSaveButtonLoading = createSelector(
    getNavigationState,
    (state: NavigationState) => state.showSaveButtonLoading
)