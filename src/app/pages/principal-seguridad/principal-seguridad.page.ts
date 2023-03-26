import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

import { FormValidarSeguComponent } from '../../componentes/form-validar-segu/form-validar-segu.component';


@Component({
  selector: 'app-principal-seguridad',
  templateUrl: './principal-seguridad.page.html',
  styleUrls: ['./principal-seguridad.page.scss'],
})
export class PrincipalSeguridadPage implements OnInit {

  aspirantesBuscar = []

  estados = []
  estado

  loadingData = false;

  constructor(
    private actionSheetCtr: ActionSheetController,
    private modalController: ModalController,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {


  }


  ionViewWillEnter() {

    this.dataService.setSubmenu('Seguridad Ocupacional');

  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  async opcionesTarea(aspirante) {

    this.dataService.getItemOpciones(aspirante, 'segu').then((res) => {
      //console.log(res);
      this.mostrarOpciones(res['aspirante'], res['botones'])
    })

  }

  async mostrarOpciones(aspirante, botones) {

    let strTitulo = aspirante.asp_nombre || `${aspirante.asp_nombres} ${aspirante.asp_apellidop} ${aspirante.asp_apellidom}`

    botones.forEach(element => {

      const strFunct = element['handler'].toString();
      element['handler'] = () => eval(strFunct);

    });

    const opciones = await this.actionSheetCtr.create({
      header: strTitulo,
      cssClass: 'action-sheet-th',
      buttons: botones,
    });

    await opciones.present();

  }


  async abrirFormsegu(aspirante) {

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarSeguComponent,
      cssClass: 'my-modal-class',
      componentProps: {
        aspirante: objAspirante,
        rol: 'segu',
        objModal: this.modalController
      }
    });

    await modal.present();

    //const { data } = await modal.onDidDismiss();
    const { data } = await modal.onWillDismiss();
    //console.log(data)

    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

    this.dataService.mostrarLoading( );

    this.dataService.verifySeguridad(data.aspirante).subscribe(res => {

      console.log(res)
      if (res['success'] === true) {
        //console.log(res);
        this.dataService.getAspirantesApi();
        this.dataService.presentAlert("VALIDACION COMPLETA", "La información del aspirante has sido ingresada exitosamente.");
        //return;

      }

      this.dataService.cerrarLoading();

    });


  }


}
