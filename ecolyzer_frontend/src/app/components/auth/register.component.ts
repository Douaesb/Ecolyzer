import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthState } from '../../state/auth/auth.reducer';
import * as AuthActions from '../../state/auth/auth.action';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  loading = false;
  error: string | null = null;
  private readonly subscription = new Subscription();

  roles = ['ROLE_USER', 'ROLE_ADMIN'];
  roleLabels: { [key: string]: string } = {
    ROLE_USER: 'User',
    ROLE_ADMIN: 'Admin',
  };

  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.registerForm = this.fb.group(
      {
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required],
        roles: [['ROLE_USER'], Validators.required],
      },
      { validators: this.passwordsMatch }
    );
  }

  ngOnInit() {
    this.subscription.add(
      this.store
        .select((state) => state.auth)
        .subscribe((authState) => {
          this.loading = authState.loading;
          this.error = authState.error;
        })
    );
  }

  passwordsMatch(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onRoleChange(event: Event, role: string) {
    const checked = (event.target as HTMLInputElement).checked;
    const roles = this.registerForm.value.roles as string[];

    if (checked) {
      this.registerForm.patchValue({ roles: [...roles, role] });
    } else {
      this.registerForm.patchValue({ roles: roles.filter((r) => r !== role) });
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { username, email, password, roles } = this.registerForm.value;
    const formattedRoles = Array.isArray(roles) ? roles : [roles];

    this.store.dispatch(
      AuthActions.register({
        credentials: { username, email, password, roles: formattedRoles },
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
