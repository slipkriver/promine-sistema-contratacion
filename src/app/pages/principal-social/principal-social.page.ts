import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetButton, ActionSheetController, ModalController } from '@ionic/angular';
import { FormValidarSocialComponent } from 'src/app/componentes/form-validar-social/form-validar-social.component';
import { DataService } from 'src/app/services/data.service';
// import { ServPdfService } from '../../services/serv-pdf.service';
// import { Router } from '@angular/router';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';

@Component({
  selector: 'app-principal-social',
  templateUrl: './principal-social.page.html',
  styleUrls: ['./principal-social.page.scss'],
})
export class PrincipalSocialPage implements OnInit {

  estado = 10;

  loadingData = false;

  constructor(
    private actionSheetCtr: ActionSheetController,
    private modalController: ModalController,
    private dataService: DataService,
    private servicioFtp: FtpfilesService,
    private router: Router
  ) { }

  ngOnInit() {

  }


  ionViewWillEnter() {

    this.dataService.setSubmenu('Trabajado Social');
    this.dataService.getAspirantesApi();

  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  async opcionesTarea(aspirante) {

    this.dataService.getItemOpciones(aspirante, 'soci').then((res) => {
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
        handler: () => {
          setTimeout(() => {
            eval(strFunct)
          }, 500);
        }
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


  async abrirFormsocial(aspirante:any) {

    // console.log(aspirante)

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarSocialComponent,
      cssClass: 'my-modal-class',
      backdropDismiss: false,
      componentProps: {
        aspirante: objAspirante,
        rol: 'soci'
      }
    });

    // setTimeout(() => {
      //modal.present();
      await modal.present();
    // }, 500);

    const { data } = await modal.onWillDismiss();

    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

    this.dataService.mostrarLoading('Subiendo la informacion del asrpirante.',0)

    const documentos = ["ficha", "decimos", "prevencion", "depositos"]
    let aspirante_docs:any = [];

    documentos.forEach(element => {
      if (!!data[element]) aspirante_docs.push(data[element])
    });

    this.dataService.verifySocial(data.aspirante).subscribe(async (res:any) => {

      let resultado;

      // console.log(res,aspirante_docs);
      if (res['success'] === true) {
        resultado = 'true';
        resultado = await this.uploadFilePromise(aspirante_docs)
      }

      if (resultado === 'true') {
        this.dataService.servPresentAlert("VALIDACION COMPLETA", "La información del aspirante ha sido ingresada exitosamente.");
        this.dataService.getAspirantesApi();
      } else {
        // console.log(resultado, 'Fail');
        this.dataService.servPresentAlert("ERROR DE INGRESAR", "La información del aspirante NO podido ser ingresada al sistema.");
      }

    });

  }


  async uploadFilePromise(files:any[]) {
    const promises:any = [];
    let cont = 0;

    files.forEach(archivo => {
      const promise = new Promise(resolve => {
        this.servicioFtp.uploadFile(archivo).subscribe((res:any) => {
          //console.log('Archivo', res['success'], cont);
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
