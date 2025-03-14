import { createAction, props } from '@ngrx/store';
import { User } from '../../model/user.model';

// Load Users
export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: string }>());

// Update Roles
export const updateUserRoles = createAction('[User] Update User Roles', props<{ id: string; roles: string[] }>());
export const updateUserRolesSuccess = createAction('[User] Update User Roles Success', props<{ id: string; roles: string[] }>());
export const updateUserRolesFailure = createAction('[User] Update User Roles Failure', props<{ error: string }>());

// Approve User
export const approveUser = createAction('[User] Approve User', props<{ id: string }>());
export const approveUserSuccess = createAction('[User] Approve User Success', props<{ id: string }>());
export const approveUserFailure = createAction('[User] Approve User Failure', props<{ error: string }>());

// Delete User
export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction('[User] Delete User Success', props<{ id: string }>());
export const deleteUserFailure = createAction('[User] Delete User Failure', props<{ error: string }>());

