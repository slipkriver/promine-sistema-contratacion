import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController, ActionSheetButton } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';

import { FormValidarSeguComponent } from '../../componentes/form-validar-segu/form-validar-segu.component';


@Component({
  selector: 'app-principal-seguridad',
  templateUrl: './principal-seguridad.page.html',
  styleUrls: ['./principal-seguridad.page.scss'],
})
export class PrincipalSeguridadPage implements OnInit {

  estado = 8;

  loadingData = false;

  constructor(
    private actionSheetCtr: ActionSheetController,
    public modalController: ModalController,
    private dataService: DataService,
    private servicioFtp: FtpfilesService,
    private router: Router,
  ) { }

  ngOnInit() {

  }


  ionViewWillEnter() {

    this.dataService.setSubmenu('Seguridad Ocupacional');
    this.dataService.getAspirantesApi();

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

    let actshtBotones: ActionSheetButton[] = [];
    let obj = this as object;

    botones.forEach((boton) => {
      const strFunct = boton['evento'].toString();
      const jsonElem = <ActionSheetButton>({
        name: boton['name'],
        text: boton['text'],
        icon: boton['icon'],
        cssClass: boton['cssClass'],
        handler: () => eval("setTimeout(() => { "+strFunct+" }, 500);")
      });

      actshtBotones.push(jsonElem)

    });

    const opciones = await this.actionSheetCtr.create({
      header: strTitulo,
      cssClass: 'action-sheet-th',
      buttons: actshtBotones,
    });

    await opciones.present();

  }


  async abrirFormsegu(aspirante) {

    //this.dataService.mostrarLoading()
    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarSeguComponent,
      backdropDismiss: false,
      cssClass: 'my-modal-class',
      componentProps: {
        aspirante: objAspirante,
        rol: 'segu'
      }
    });

    await modal.present();

    //this.dataService.cerrarLoading()
    //const { data } = await modal.onDidDismiss();
    const { data } = await modal.onWillDismiss();

    //return;

    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

    //return

    this.dataService.mostrarLoading("<p>Subiendo archivos.\n Espere por favor hasta que finalice el proceso.</p>")

    const documentos = ["induccion", "procedimiento", "certificacion", "entrenamiento", "matrizriesgos", "evaluacion"]
    let aspirante_docs = [];

    documentos.forEach(element => {
      if (!!data[element]) aspirante_docs.push(data[element])
    });

    this.dataService.verifySeguridad(data.aspirante).subscribe(async res => {

      let resultado;

      if (res['success'] === true) {
        resultado = 'true';
        resultado = await this.uploadFilePromise(aspirante_docs)
      }

      // console.log(resultado, 'OK', cont);
      if (resultado === 'true') {
        this.dataService.presentAlert("VALIDACION COMPLETA", "La información del aspirante ha sido ingresada exitosamente.");
        this.dataService.getAspirantesApi();
      } else {
        // console.log(resultado, 'Fail');
        this.dataService.presentAlert("ERROR DE INGRESAR", "La información del aspirante NO podido ser ingresada al sistema.");
      }

    });

  }


  async uploadFilePromise(files) {
    const promises = [];
    let cont = 0;

    files.forEach(archivo => {
      const promise = new Promise(resolve => {
        this.servicioFtp.uploadFile(archivo).subscribe(res => {
          console.log('Archivo', res['success'], cont);
          if (res['success']) {
            cont++;
          }
          resolve('true');
        });
      });

      promises.push(promise);
    });

    await Promise.all(promises);
    this.dataService.cerrarLoading();
    return 'true';
  }


}
