import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AuthState } from '../../state/auth/auth.reducer';
import * as AuthActions from '../../state/auth/auth.action';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { LoginCredentials } from '../../model/auth.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  error: string | null = null;
  hidePassword = true; 
  private readonly subscription = new Subscription();

  constructor(private readonly fb: FormBuilder, private readonly store: Store<{ auth: AuthState }>) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscription.add(
      this.store.select(state => state.auth).subscribe(authState => {
        this.loading = authState.loading;
        this.error = authState.error;
        console.log('Auth State after login:', authState);
      })
    );
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const credentials = {
        usernameOrEmail: this.loginForm.value.email, 
        password: this.loginForm.value.password
      };
  
      console.log('Dispatching login:', credentials); // Debugging log
      this.store.dispatch(AuthActions.login({ credentials }));
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
  

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
