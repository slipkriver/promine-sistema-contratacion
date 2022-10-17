import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials: FormGroup;
    
  constructor( 
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router
     ) {}

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

  async login() {
    const loading = await this.loadingController.create({
      spinner: 'bubbles',
      duration: 5000,
      message: 'Espere por favor...',
      translucent: true,
      // cssClass: 'custom-loader-class',
      backdropDismiss: true
    });
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if(user) {
      this.router.navigateByUrl('/inicio', {replaceUrl: true});
    }else {
      this.showAlert('Error de inicio de sesión', 'Por favor intente nuevamente');
    }
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

}
