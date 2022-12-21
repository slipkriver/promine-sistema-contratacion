export interface User {
  uid: string;
  cedula: string;
  displayName: string;
  email: string;
  password: string;
  emailVerified: boolean;
  fechalogin: Date;
  role: string;
}

export interface Componente {
  icon: string;
  name: string;
  redirectTo: string;
}