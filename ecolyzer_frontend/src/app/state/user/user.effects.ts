import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as UserActions from '../../state/user/user.actions';
import { UserService } from '../../services/user.service';

@Injectable()
export class UserEffects {
    constructor(private actions$: Actions, private userService: UserService) {}

    // Load Users
    loadUsers$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.loadUsers),
            tap(() => console.log("Effect triggered: loadUsers action detected")),
            mergeMap(() =>
                this.userService.getAllUsers().pipe(
                    tap(users => console.log("Fetched Users from API: ", users)), // Log the API response
                    map(users => UserActions.loadUsersSuccess({ users })),
                    catchError(error => {
                        console.error("Error fetching users:", error);
                        return of(UserActions.loadUsersFailure({ error: error.message }));
                    })
                )
            )
        )
    );

    // Update Roles
    updateUserRoles$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.updateUserRoles),
            mergeMap(({ id, roles }) =>
                this.userService.updateUserRoles(id, roles).pipe(
                    map(() => UserActions.updateUserRolesSuccess({ id, roles })),
                    catchError((error) => of(UserActions.updateUserRolesFailure({ error: error.message })))
                )
            )
        )
    );

    // Approve User
    approveUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.approveUser),
            mergeMap(({ id }) =>
                this.userService.approveUser(id).pipe(
                    map(() => UserActions.approveUserSuccess({ id })),
                    catchError((error) => of(UserActions.approveUserFailure({ error: error.message })))
                )
            )
        )
    );

    // Delete User
    deleteUser$ = createEffect(() =>
        this.actions$.pipe(
            ofType(UserActions.deleteUser),
            mergeMap(({ id }) =>
                this.userService.deleteUser(id).pipe(
                    map(() => UserActions.deleteUserSuccess({ id })),
                    catchError((error) => of(UserActions.deleteUserFailure({ error: error.message })))
                )
            )
        )
    );
}
