import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;
  sesionActiva = true;

  constructor(
    private fb: FormBuilder,
    //private loadingController: LoadingController,
    private alertController: AlertController,
    private dataService: DataService,
    private router: Router,
    private zone: NgZone

  ) {


    /*dataService.getuserlogin$.subscribe(user => {
      if (!!user) {
        this.getLoginUser()
      } else {
        if (this.authService.userLocal?.['email']) {
          this.credentials.value['email'] = this.authService.userLocal['email'];
          this.credentials.value['password'] = this.authService.uncryptPassword(this.authService.userLocal['password']);
          this.login()
        }
        else {
          setTimeout(() => {
            authService.mostrarLoading(false)
          }, 2000);
        }
      }
    })*/

  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  ngOnInit() {


    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

  ionViewWillEnter() {

  }

  /*async getLoginUser() {
    const x = this.authService.userLogin;
    // console.log(this.authService.userLocal, x,this.authService.userLogin)

    if (!!x.email && x != undefined) {
      //this.router.navigateByUrl('/inicio', { replaceUrl: true });
      this.router.navigate(['/inicio'])
      return;
    } else {
      if (!this.authService.userLogin.email && !!this.authService.userLocal['email']) {
        this.credentials.value['email'] = this.authService.userLocal['email'];
        this.credentials.value['password'] = this.authService.uncryptPassword(this.authService.userLocal['password']);
        //console.log("UPDATE DATA LOCAL", x, this.credentials, this.authService.userLocal)
        //this.login()
      }
    }

  }*/

  async login() {
    this.dataService.mostrarLoading("Iniciando sesion de usuario", 2)
    let user;
    this.dataService.getIpAddress().subscribe(resIp => {

      user = this.dataService.loginUsuario(this.credentials.value, resIp['ip']).then(res => {
        // console.log(res)
        //user = res
        if (res['success'] == true) {
          if (this.sesionActiva == true) {
            //console.log("## LOGIN -> ", this.authService.getUserLoging());
            //this.authService.setUserLoging(this.credentials.value['email'], this.credentials.value['password'])
          }
          //this.router.navigateByUrl('/inicio', { replaceUrl: true });
          this.zone.run(() => {
            //this.router.navigate(['/login']);
            this.router.navigate(['/inicio'])
          });
          // this.dataService.mostrarLoading(false);
          this.dataService.cerrarLoading();

        } else {
          this.dataService.cerrarLoading();
          this.showAlert('Error de inicio de sesión', 'Por favor intente nuevamente');

        }

      })

    })

    // .then(res => {
    // console.log(x, "login user >>> ", user);
    //user = res;

    // })


    // setTimeout(() => {
    // }, 2000);

    //return

  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      // cssClass:'my-custom-class',
      buttons: ['OK'],
    });
    await alert.present();
  }

  setSesionActiva(evento) {
    this.sesionActiva = evento.detail.checked;
    //console.log(evento.detail.checked, this.sesionActiva)
  }


  keyPressed(event) {
    // console.log(event.key);
    if (event.key === "Enter") {
      this.login()
    }
  }

}
