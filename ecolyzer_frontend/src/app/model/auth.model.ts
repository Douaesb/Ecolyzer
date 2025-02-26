export interface AuthResponse {
    token: string;
    username: string;
    authorities: string[];
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface RegisterCredentials {
    username: string;
    password: string;
    roles: string[];
  }
  