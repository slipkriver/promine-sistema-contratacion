import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FormValidarSocialComponent } from 'src/app/componentes/form-validar-social/form-validar-social.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-principal-social',
  templateUrl: './principal-social.page.html',
  styleUrls: ['./principal-social.page.scss'],
})
export class PrincipalSocialPage implements OnInit {

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


  ionViewDidEnter() {

    this.dataService.setSubmenu('Trabajado Social');

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

    console.log(aspirante)
    
    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarSocialComponent,
      cssClass: 'my-modal-class',
      componentProps: {
        aspirante: objAspirante,
        rol: 'social',
        objModal: this.modalController
      }
    });
    await modal.present();
    
    const { data } = await modal.onWillDismiss();

    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

  }


}
