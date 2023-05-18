export interface User {
  uid: string;
  email: string;
  session: string;
  lastlogin: string;
  displayname: string;
  role: string;
  iplogin: string;
  photo: string;
  password: string;
}

export interface Componente {
  icon: string;
  name: string;
  redirectTo: string;
}