import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';

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
    private servicioFtp: FtpfilesService,
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

    //return;

    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

    // console.log(data)

    this.dataService.mostrarLoading("Subiendo datos del trabajador");
    
    this.dataService.verifySeguridad(data.aspirante).subscribe(async res => {

      let resultado;
      let flag:boolean = false;

      if (res['success'] === true) {
        if (data.induccion != null) {
          flag = (data.procedimiento)?false:true;
          resultado = await this.uploadFilePromise(data.induccion,flag);
        }
        if (data.procedimiento != null) {
          flag = (data.certificacion)?false:true;
          resultado = await this.uploadFilePromise(data.procedimiento,flag);
        }
        if (!!data.certificacion) {
          flag = (data.entrenamiento)?false:true;
          resultado = await this.uploadFilePromise(data.certificacion,flag);
        }
        if (!!data.entrenamiento) {
          flag = (data.matrizriesgos)?false:true;
          resultado = await this.uploadFilePromise(data.entrenamiento,flag);
        }
      }
      
      if (resultado === 'true') {
        this.dataService.cerrarLoading();
        // console.log(resultado, 'OK');
        this.dataService.presentAlert("VALIDACION COMPLETA", "La información del aspirante ha sido ingresada exitosamente.");
        this.dataService.getAspirantesApi();
      }else{
        this.dataService.cerrarLoading();
        // console.log(resultado, 'Fail');
        this.dataService.presentAlert("ERROR DE INGRESAR", "La información del aspirante NO podido ser ingresada al sistema.");
      }

    });

  }


  async uploadFilePromise(file,flag) {
    return new Promise(resolve => {
      this.servicioFtp.uploadFile(file).subscribe(res => {
        console.log('Archivo', res['success'], flag);
        resolve(res['success'].toString());
      });
    });
  }


}
