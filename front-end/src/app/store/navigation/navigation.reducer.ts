import {GetNavigationsByRole, NavigationFormData} from "@store/navigation/navigation.model";
import {createReducer, on} from "@ngrx/store";
import {
    getNavigationFormData,
    manageNavigationGridLoading, manageNavigationPermissionLoading, onNavigationByRoleIdSuccess,
    onNavigationFormDataSuccess, onRestNavigationState, showSaveButtonLoading
} from "@store/navigation/navigation.actions";

export interface NavigationState {
    navigationFormData: NavigationFormData;
    isGridLoading: boolean;
    isNavigationPermissionLoading: boolean;
    navigationWithRole: GetNavigationsByRole;
    showSaveButtonLoading: boolean;
}

export const initialNavigationState: NavigationState = {
    navigationFormData: null,
    isGridLoading: false,
    navigationWithRole: null,
    isNavigationPermissionLoading: false,
    showSaveButtonLoading: false
}

export const navigationReducer = createReducer(
    initialNavigationState,
    on(getNavigationFormData, (state, data) => ({
        ...state,
        isGridLoading: true
    })),
    on(onNavigationFormDataSuccess, (state, data) => ({
        ...state,
        navigationFormData: data.data
    })),
    on(manageNavigationGridLoading, (state, data) => ({
        ...state,
        isGridLoading: data.show
    })),
    on(onNavigationByRoleIdSuccess, (state, data) => ({
        ...state,
        navigationWithRole: data.data
    })),
    on(manageNavigationPermissionLoading, (state, data) => ({
        ...state,
        isNavigationPermissionLoading: data.show
    })),
    on(showSaveButtonLoading, (state, data) => ({
        ...state,
        showSaveButtonLoading: data.show
    })),
    on(onRestNavigationState, () => initialNavigationState)
)