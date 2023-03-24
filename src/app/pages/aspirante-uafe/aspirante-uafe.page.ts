import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { AspiranteInfo } from '../../interfaces/aspirante';

import { LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-aspirante-uafe',
  templateUrl: './aspirante-uafe.page.html',
  styleUrls: ['./aspirante-uafe.page.scss'],
})
export class AspiranteUafePage implements OnInit {
  
  aspirante = <AspiranteInfo>{}

  infogeneral: boolean = true;
  infoeconomica: boolean = true;

  guardando = false;

  constructor(
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async onSubmitTemplate() {
    // const loading = await this.loadingCtrl.create({
    //   message: '<b>Guardando información... <b><br>Espere por favor',
    //   translucent: true,
    //   duration: 2000,
    // });
    // loading.present()

    // let objAspirante = new AspiranteSoci()
    //type objAspirante = typeof AspiranteSoci;
    // Object.keys(objAspirante).map(key => {
      //console.log(key)  
      // objAspirante[key] = this.aspirante[key];
      //return { text: key, value: key }
    // });

    // this.dataService.verifySocial(objAspirante).subscribe(res => {
      // console.log(res)
    // })
    console.log('INGRESO')
  }

  cancelarSolicitud() {
    this.navCtrl.navigateBack(['/inicio']);
  }
  
  mostrarContenido(contenido) {

    this[contenido] = (this[contenido]) ? false : true

  }

}
