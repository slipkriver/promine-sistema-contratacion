export interface User {
  uid: string;
  email: string;
  displayName: string;
  emailVerified: boolean;
}

export interface Componente {
  icon: string;
  name: string;
  redirectTo: string;
}