import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormValidarMediComponent } from '../../componentes/form-validar-medi/form-validar-medi.component';
import { ActionSheetButton, ActionSheetController, ModalController } from '@ionic/angular';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';

import { Router } from '@angular/router';

@Component({
  selector: 'app-principal-medicina',
  templateUrl: './principal-medicina.page.html',
  styleUrls: ['./principal-medicina.page.scss'],
})

export class PrincipalMedicinaPage {

  estado = 2;
  textobusqueda = ""


  constructor(
    private dataService: DataService,
    private actionSheetCtr: ActionSheetController,
    public modalController: ModalController,
    private servicioFtp: FtpfilesService,
    private router: Router
  ) {


  }


  ngOnInit() {
  }
  
  
  ionViewWillEnter() {
    this.dataService.setSubmenu('Departamento Medico');
    this.dataService.getAspirantesApi();

  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  async opcionesTarea(aspirante) {

    this.dataService.getItemOpciones(aspirante, 'medi').then((res) => {
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


  async abrirFormmedi(aspirante) {

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarMediComponent,
      cssClass: 'my-modal-class',
      backdropDismiss: false,
      componentProps: {
        aspirante: objAspirante,
        rol: 'medi'
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();


    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

    //data.aspirante.asp_estado = "APROBADO"
    //this.dataService.mostrarLoading();
    this.dataService.mostrarLoading('Subiendo la informacion del asrpirante.',0)

    this.dataService.verifyMedicina(data.aspirante).subscribe(res => {

      if (res['success'] == true) {


        if (data.historia != null) {
          this.servicioFtp.uploadFile(data.historia).subscribe(resH => {
            res = resH;
            if (!data.ficha) this.dataService.cerrarLoading()
            //this.dataService.cerrarLoading();
          })
        }

        if (data.ficha != null) {
          this.servicioFtp.uploadFile(data.ficha).subscribe(resF => {
            res = resF;
            this.dataService.cerrarLoading();
          })
        }

        this.dataService.getAspirantesApi();
        this.dataService.servPresentAlert("VALIDACION COMPLETA", "La información del aspirante has sido ingresada exitosamente.")

      }

      this.dataService.cerrarLoading();

    })

  }




}