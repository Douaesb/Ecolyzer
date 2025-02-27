export interface AuthResponse {
    token: string;
    username: string;
    email: string;  
    authorities: string[];
  }
  
  export interface LoginCredentials {
    usernameOrEmail: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    roles: string[];
  }
  