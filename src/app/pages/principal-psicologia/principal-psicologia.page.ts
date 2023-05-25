import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';
import { ActionSheetButton, ActionSheetController, ModalController } from '@ionic/angular';
import { FormValidarPsicoComponent } from '../../componentes/form-validar-psico/form-validar-psico.component';

import { Router } from '@angular/router';

@Component({
  selector: 'app-principal-psicologia',
  templateUrl: './principal-psicologia.page.html',
  styleUrls: ['./principal-psicologia.page.scss'],
})

export class PrincipalPsicologiaPage {

  estado = 4;

  textobusqueda = ""


  constructor(
    private dataService: DataService,
    private actionSheetCtr: ActionSheetController,
    public modalController: ModalController,
    private servicioFtp: FtpfilesService,
    private router: Router,

  ) {


  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    //this.dataService.mostrarLoading$.emit(true)
    this.dataService.setSubmenu('Psicologia');
    this.dataService.getAspirantesApi();


  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  async opcionesTarea(aspirante) {

    this.dataService.getItemOpciones(aspirante, 'psico').then((res) => {
      //console.log(res);
      this.mostrarOpciones(res['aspirante'], res['botones'])
    })

  }


  async mostrarOpciones(aspirante, botones) {

    let strTitulo = aspirante.asp_nombre || `${aspirante.asp_nombres} ${aspirante.asp_apellidop} ${aspirante.asp_apellidom}`

    let actshtBotones: ActionSheetButton[] = [];

    botones.forEach((boton) => {
      let obj = this as object;
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



  async abrirFormpsico(aspirante) {

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarPsicoComponent,
      cssClass: 'my-modal-class',
      backdropDismiss: false,
      componentProps: {
        aspirante: objAspirante,
        rol: 'psico',
        objModal: this.modalController
      },
    });
    
    await modal.present();

    const { data } = await modal.onDidDismiss();

    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

    this.dataService.mostrarLoading('Subiendo archivos. Espere por favor hasta que finalice el proceso.')

    this.dataService.verifyPsicologia(data.aspirante).subscribe(res => {

      //return;
      if (res['success'] == true) {
        
        if (data.ficha != null) {
          this.servicioFtp.uploadFile(data.ficha).subscribe(resF => {
            // console.log(resF,data.test)
            res = resF
            if (!data.test) this.dataService.cerrarLoading()
          })
        }

        if (data.test != null) {
          this.servicioFtp.uploadFile(data.test).subscribe(resT => {
            res = resT
            this.dataService.cerrarLoading()
          })
        }

        this.dataService.getAspirantesApi();
        this.dataService.presentAlert("VALIDACION COMPLETA", "La información del aspirante has sido ingresada exitosamente.");


      }

      this.dataService.cerrarLoading();

    })

    // }
  }


}
