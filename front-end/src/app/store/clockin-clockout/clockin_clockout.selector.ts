import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClockinoutState } from './clockin_clockout.reducer';

export const selectClockinoutState = createFeatureSelector<ClockinoutState>('in-out');

export const selectLoadProfileData = createSelector(
  selectClockinoutState,
  (state) => state?.loadprofiledata
);

export const selectClockinoutDetails = createSelector(
  selectClockinoutState,
  (state) => state?.clockinoutDetails
);

export const selectAttanedanceStatus = createSelector(
  selectClockinoutState,
  (state) => state?.loadattandacestatus
);


export const selectallinandoutdata = createSelector(
  selectClockinoutState,
  (state) => state?.loadallinandoutdata
);

export const selectIsLoading = createSelector(
  selectClockinoutState,
  (state) => state?.isLoading
);

export const selectError = createSelector(
  selectClockinoutState,
  (state) => state?.error
);

// convenience selector that mirrors selectProfileStatus style
export const selectClockinoutDetailsStatus = createSelector(
  selectClockinoutDetails,
  selectIsLoading,
  (details, loading) => ({ details, loading })
);

export const selectProfileStatus = createSelector(
  selectLoadProfileData,
  selectIsLoading,
  selectAttanedanceStatus,
  (profile, loading) => ({
    profile,
    loading
  })
);

export const selectUserWishes = createSelector(
  selectClockinoutState,
  (state) => state.userMessage
);

export const selectOtherWishes = createSelector(
  selectClockinoutState,
  (state) => state.otherCelebrantsMessage
);

export const selectWishesLoading = createSelector(
  selectClockinoutState,
  (state) => state.wishesLoading
);

