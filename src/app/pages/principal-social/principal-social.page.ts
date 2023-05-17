import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FormValidarSocialComponent } from 'src/app/componentes/form-validar-social/form-validar-social.component';
import { DataService } from 'src/app/services/data.service';
import { ServPdfService } from '../../services/serv-pdf.service';
import { Router } from '@angular/router';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';

@Component({
  selector: 'app-principal-social',
  templateUrl: './principal-social.page.html',
  styleUrls: ['./principal-social.page.scss'],
})
export class PrincipalSocialPage implements OnInit {

  aspirantesBuscar = []
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

    //TEST PDF ACUMULACION DECIMOS >>>      
    //console.log(this.dataService.aspirantes[0].asp_cedula);  
    // this.pdfService.getPdfFichapsicologia(this.dataService.aspirantes[0])

    // .subscribe( res => {

    // });

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


  async abrirFormsocial(aspirante) {

    // console.log(aspirante)

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarSocialComponent,
      cssClass: 'my-modal-class',
      componentProps: {
        aspirante: objAspirante,
        rol: 'social',
        // objModal: this.modalController
      }
    });

    setTimeout(() => {
      modal.present();
      // await modal.present();
    }, 500);

    const { data } = await modal.onWillDismiss();

    if (!data || data == undefined || data.role == "cancelar") {
      modal.dismiss()
      return;
    }

    this.dataService.mostrarLoading("Subiendo datos del trabajador", 0);

    const documentos = ["ficha", "decimos", "prevencion", "depositos"]
    let aspirante_docs = [];

    documentos.forEach(element => {
      if (!!data[element]) aspirante_docs.push(data[element])
    });

    this.dataService.verifySocial(data.aspirante).subscribe(async res => {

      let resultado;

      // console.log(res,aspirante_docs);
      if (res['success'] === true) {
        resultado = 'true';
        resultado = await this.uploadFilePromise(aspirante_docs)
      }

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
