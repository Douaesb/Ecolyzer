import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../../state/user/user.actions';
import { User } from '../../model/user.model';

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const userReducer = createReducer(
  initialState,

  // Load Users
  on(UserActions.loadUsers, (state) => ({ ...state, loading: true })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    loading: false,
    users: users.map(user => ({
      ...user,
      formattedRoles: user.roles
        .map(role => role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_USER' ? 'User' : role)
        .join(", ")
    }))
  })),
    on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, loading: false, error })),

  // Update Roles
  on(UserActions.updateUserRolesSuccess, (state, { id, roles }) => ({
    ...state,
    users: state.users.map((user) =>
      user.id === id
        ? {
            ...user,
            roles,
            formattedRoles: roles
              .map(role => role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_USER' ? 'User' : role)
              .join(", ")
          }
        : user
    ),
  })),
  
  on(UserActions.updateUserRolesFailure, (state, { error }) => ({ ...state, error })),

// Approve User
on(UserActions.approveUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.map(user =>
        user.id === id
            ? {
                    ...user,
                    approved: true,
                    formattedRoles: user.formattedRoles 
                }
            : user
    )
})),

on(UserActions.approveUserFailure, (state, { error }) => ({ ...state, error })),

// Delete User
on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter(user => user.id !== id)
})),

on(UserActions.deleteUserFailure, (state, { error }) => ({ ...state, error })),
);
