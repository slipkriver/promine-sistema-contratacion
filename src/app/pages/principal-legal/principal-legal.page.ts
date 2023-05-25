import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController, ActionSheetButton } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { FormValidarLegalComponent } from '../../componentes/form-validar-legal/form-validar-legal.component';

@Component({
  selector: 'app-principal-legal',
  templateUrl: './principal-legal.page.html',
  styleUrls: ['./principal-legal.page.scss'],
})
export class PrincipalLegalPage {

  estado = 6;

  textobusqueda = ""


  constructor(
    private actionSheetCtr: ActionSheetController,
    private modalController: ModalController,
    private dataService: DataService,
    private router: Router,
  ) { }


  ngOnInit() {


  }


  ionViewWillEnter() {
    this.dataService.setSubmenu('Legal');
    this.dataService.getAspirantesApi();

  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  async opcionesTarea(aspirante) {

    // const apto = (aspirante.asp_estado == 9) ? false : true;
    // const x = this.dataService.getItemOpciones(aspirante)
    this.dataService.getItemOpciones(aspirante, 'legal').then((res) => {
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


  async abrirFormlegal(aspirante) {

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarLegalComponent,
      cssClass: 'my-modal-class',
      backdropDismiss: false,
      componentProps: {
        aspirante: objAspirante,
        rol: 'legal',
      }
    });

    await modal.present();

    // const { data } = await modal.onDidDismiss();
    const { data } = await modal.onDidDismiss();
    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }
    // console.log('onWillDismiss');

    // return

    this.dataService.verifyLegal(data.aspirante).subscribe(res => {

      if (res['success'] === true) {
        //console.log(res);
        this.dataService.getAspirantesApi();
        this.dataService.presentAlert("VALIDACION COMPLETA", "La información del aspirante has sido ingresada exitosamente.");
        //return;

      }

      this.dataService.cerrarLoading();

    })

  }


}

