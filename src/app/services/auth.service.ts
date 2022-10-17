import { Injectable } from '@angular/core';

import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor( private auth: Auth ) {}

//login
async login ({ email, password }) {
  try {
    const user = await signInWithEmailAndPassword(this.auth, email, password);
    return user;
  } catch (e) {
    return null;
  }
}

//logout
logout() {
  return signOut(this.auth);
}

}
