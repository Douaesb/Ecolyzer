import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from '../../state/user/user.reducer';

// Feature Selector
export const selectUserState = createFeatureSelector<UserState>('users');

// Select Users
export const selectAllUsers = createSelector(selectUserState, (state) => state.users);

// Select Loading
export const selectUsersLoading = createSelector(selectUserState, (state) => state.loading);

// Select Error
export const selectUsersError = createSelector(selectUserState, (state) => state.error);

export const selectUsersWithRoleUser = createSelector(
    selectAllUsers,
    (users) => users.filter(user => user.roles.includes('ROLE_USER'))
);