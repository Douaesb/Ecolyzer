// register.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="text-center text-3xl font-bold text-gray-800 mb-6">Créer un compte</h2>
        <div class="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="space-y-6">
            <!-- Full Name -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 mb-1">
                  Prénom
                </label>
                <div class="relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="material-icons text-gray-400 text-lg">person</span>
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    [(ngModel)]="firstName"
                    required
                    class="block w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Prénom"
                  >
                </div>
              </div>
              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 mb-1">
                  Nom
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  [(ngModel)]="lastName"
                  required
                  class="block w-full py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Nom"
                >
              </div>
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-icons text-gray-400 text-lg">email</span>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  [(ngModel)]="email"
                  required
                  class="block w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="votreemail@exemple.com"
                >
              </div>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-icons text-gray-400 text-lg">lock</span>
                </div>
                <input
                  [type]="hidePassword ? 'password' : 'text'"
                  id="password"
                  name="password"
                  [(ngModel)]="password"
                  required
                  minlength="8"
                  class="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Minimum 8 caractères"
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button 
                    type="button" 
                    class="text-gray-400 hover:text-gray-500 focus:outline-none"
                    (click)="hidePassword = !hidePassword"
                  >
                    <span class="material-icons">
                      {{ hidePassword ? 'visibility_off' : 'visibility' }}
                    </span>
                  </button>
                </div>
              </div>
              <!-- Password strength indicator -->
              <div class="mt-2 flex space-x-1">
                <div class="h-1 flex-1 rounded-full" [ngClass]="password.length > 0 ? 'bg-red-400' : 'bg-gray-200'"></div>
                <div class="h-1 flex-1 rounded-full" [ngClass]="password.length >= 4 ? 'bg-orange-400' : 'bg-gray-200'"></div>
                <div class="h-1 flex-1 rounded-full" [ngClass]="password.length >= 8 ? 'bg-yellow-400' : 'bg-gray-200'"></div>
                <div class="h-1 flex-1 rounded-full" [ngClass]="password.length >= 12 ? 'bg-green-400' : 'bg-gray-200'"></div>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div class="relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="material-icons text-gray-400 text-lg">lock_clock</span>
                </div>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  [(ngModel)]="confirmPassword"
                  required
                  class="block w-full pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Confirmer votre mot de passe"
                >
              </div>
              <div *ngIf="password && confirmPassword && password !== confirmPassword" class="mt-1 text-sm text-red-600">
                Les mots de passe ne correspondent pas
              </div>
            </div>

            <!-- Terms and Conditions -->
            <div class="flex items-center">
              <input 
                id="terms" 
                name="terms" 
                type="checkbox"
                [(ngModel)]="acceptTerms"
                required
                class="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
              >
              <label for="terms" class="ml-2 block text-sm text-gray-700">
                J'accepte les <a href="#" class="text-yellow-600 hover:text-yellow-500">conditions d'utilisation</a> et la <a href="#" class="text-yellow-600 hover:text-yellow-500">politique de confidentialité</a>
              </label>
            </div>

            <!-- Register Button -->
            <div>
              <button 
                type="submit" 
                [disabled]="!registerForm.valid || password !== confirmPassword"
                class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="material-icons mr-2">how_to_reg</span>
                Créer mon compte
              </button>
            </div>
          </form>

          <!-- Divider -->
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Ou s'inscrire avec
                </span>
              </div>
            </div>

            <!-- Social Register Buttons -->
            <div class="mt-6 grid grid-cols-2 gap-3">
              <div>
                <a href="#" class="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <span class="material-icons mr-2">language</span>
                  Google
                </a>
              </div>
              <div>
                <a href="#" class="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  <span class="material-icons mr-2">work</span>
                  Microsoft
                </a>
              </div>
            </div>
          </div>

          <!-- Sign In Link -->
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Déjà un compte?
              <a routerLink="/login" class="font-medium text-yellow-600 hover:text-yellow-500">
                Se connecter
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
  `]
})
export class RegisterComponent {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  hidePassword: boolean = true;
  acceptTerms: boolean = false;

  onRegister() {
    // Implement register logic here
    if (this.password !== this.confirmPassword) {
      return;
    }
    console.log('Register attempt with:', this.email);
  }
}