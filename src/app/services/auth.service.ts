import { EventEmitter, Injectable } from '@angular/core';

import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, authState, signOut, authInstance$ } from '@angular/fire/auth';
//import { DataService } from './data.service';


import JSEncrypt from 'jsencrypt';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userConfig = {};

  privCode = `MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQABAoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fvxTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeHm7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAFz/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIMV7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATeaTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5AzilpsLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Ozuku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876`;
  publiCode = `MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQWMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNRaY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB`;

  userLogin: User;

  userNew: User = {
    uid: '',
    email: '',
    password: '',
    displayname: 'Invitado',
    session: '',
    role: 'tthh',
    iplogin: '0.0.0.0',
    lastlogin: new Date(),
    photo: 'assets/icon/person.png'
  }

  userLocal: User;
  getuserlogin$ = new EventEmitter<any>();


  constructor(
    private auth: Auth,
    //private dataService: DataService
  ) {

    this.userLogin = { ... this.userNew }

    //auth;
    //this.getUserLoging()


  }

  //login
  async login({ email, password }, userip, activo = true) {
    try {
      this.userLogin.email = email;
      this.userLogin.password = this.encryptPassword(password).toString();
      const user = await signInWithEmailAndPassword(this.auth, email, password);

      const userLogin = {
        email: user.user.email,
        uid: user.user.uid,
        session: user.user['auth'].currentUser.accessToken,
        iplogin: userip
      }

      /*this.dataService.setUserLogin(userLogin).subscribe(res => {
        //const options: any = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fecha = new Date(res['usuario'].lastlogin).toLocaleString('es-EC');
        res['usuario'].lastlogin = fecha;
        // console.log(userLogin, res['usuario'], fecha);

        this.dataService.userLogin = res['usuario'];
        this.setUserLoging(res['usuario'])
      })*/
      
      //console.log(user,userLogin)
      return userLogin;

    } catch (e) {
      return null;
    }
  }

  //logout
  logout() {
    // this.dataService.dataLocal.setConfig("user", {})
    this.userLocal = null;
    //this.dataService.submenu$.closed = true; //.unsubscribe();
    //this.userLogin = {...this.userNew}; 
    //console.log("Log OFF ")
    return signOut(this.auth);
  }

  async getUserLoging() {

    // console.log("**getUser ",this.userLocal, "..NO USER", this.userLogin)

    this.auth.onAuthStateChanged(async(user: any) => {
      if (user?.email) {
        //user[password]
        this.userLogin = { ...user };
      } else {
        // console.log(this.userLocal)
        this.userLogin = { ...user };

        //this.userLogin.lastlogin = new Date();

        if (!!this.userLogin.password) {
          this.uncryptPassword(this.userLocal['password']).toString()
        } else {
          //this.dataService.mostrarLoading$.emit(false);
          return
        }
        //this.login(user)
      }
      console.log(user);
      //this.getuserlogin$.emit(user)
      //x = user
    });

  }

  setUserLoging(user) {

    /*const usuario = { ... this.userNew };
    usuario.uid = this.userLogin.uid;
    usuario.email = email;
    usuario.password = this.encryptPassword(password).toString();
    usuario.role = 'tthh';
    usuario.lastlogin = new Date(Date.now());*/
    //this.dataService.userLogin$.emit(user);
    const usuario: User = { ...user };
    //this.userConfig['user'] = user;
    // console.log(usuario, this.userLocal, this.userLogin)

    this.userLocal = usuario;
    //this.dataService.userConfig = usuario;
    //this.dataService.dataLocal.setConfig("user", usuario)
    //this.dataService.dataLocal.setConfig("role", usuario.role)

  }


  encryptPassword(textmsg: string, password?: string) {

    const encrypt = new JSEncrypt();
    //password = (!!password)?password:"DELun0@Nuev3";
    encrypt.setPublicKey(this.publiCode);
    encrypt.setPrivateKey(this.privCode);

    let encrypted = encrypt.encrypt(textmsg);
    //console.log(`en**`, encrypted, encrypt)

    return encrypted;
  }


  uncryptPassword(textmsg: string) {

    const uncrypt = new JSEncrypt();
    uncrypt.setPublicKey(this.publiCode);
    uncrypt.setPrivateKey(this.privCode);
    let uncrypted = uncrypt.decrypt(textmsg);
    //console.log(`UN**`, uncrypted, "**", textmsg)

    return uncrypted;
  }


  // Función para obtener la dirección IP del cliente
  mostrarLoading(show) {
    // console.log("Mostrar **Loading:", show)
    //this.dataService.mostrarLoading$.emit(show)
  }


}