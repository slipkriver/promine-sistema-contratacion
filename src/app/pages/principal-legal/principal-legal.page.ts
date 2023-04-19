import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { FormValidarLegalComponent } from '../../componentes/form-validar-legal/form-validar-legal.component';

@Component({
  selector: 'app-principal-legal',
  templateUrl: './principal-legal.page.html',
  styleUrls: ['./principal-legal.page.scss'],
})
export class PrincipalLegalPage implements OnInit {

  aspirantesNuevo = [];
  estado = 6;

  listaTareas: any[] = [];

  textobusqueda = ""

  numNotificaciones = 0;

  contPagina = 0;
  numPaginas = 1;
  loadingData = true;
  loadingList = [];
  showHistorial = false;
  timeoutId: NodeJS.Timeout;


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
      modal.dismiss()
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

