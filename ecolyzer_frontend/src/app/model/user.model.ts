export interface User {
    id: string;
    username: string;
    email: string;
    roles: string[];
    approved: boolean;
    formattedRoles?: string;
  }
  