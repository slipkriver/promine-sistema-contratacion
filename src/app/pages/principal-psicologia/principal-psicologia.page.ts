import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FormValidarPsicoComponent } from '../../componentes/form-validar-psico/form-validar-psico.component';
import { Router } from '@angular/router';
import { ServPdfService } from 'src/app/services/serv-pdf.service';


@Component({
  selector: 'app-principal-psicologia',
  templateUrl: './principal-psicologia.page.html',
  styleUrls: ['./principal-psicologia.page.scss'],
})

export class PrincipalPsicologiaPage implements OnInit {

  aspirantesBuscar = []

  aspirantesNuevo = []
  estado = 4;

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
    private dataService: DataService,
    private actionSheetCtr: ActionSheetController,
    public modalController: ModalController,
    private servicioFtp: FtpfilesService,
    private servicioPdf: ServPdfService,
    private router: Router,

  ) {


  }


  ngOnInit() {
  }

  ionViewWillEnter() {
    //this.dataService.mostrarLoading$.emit(true)
    this.dataService.setSubmenu('Psicologia');

  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  updatePagina(value) {
    this.contPagina = this.contPagina + value;
    //console.log(this.contPagina*4,(this.contPagina+1)*4)
    this.aspirantesNuevo = this.listaTareas.slice(this.contPagina * 6, (this.contPagina + 1) * 6);
  }


  async opcionesTarea(aspirante) {

    this.dataService.getItemOpciones(aspirante, 'psico').then((res) => {
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
    modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

    this.dataService.mostrarLoading('Subiendo archivo. Espere por favor hasta que finalice el proceso.')

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


  buscarAspirante(event) {

    if (event.detail.value.length < 3) return

    this.aspirantesBuscar = []

    this.dataService.getListanuevos(event.detail.value).subscribe(res => {
      //console.log(res['result'])
      if (res['result'] && res['result'].length > 0) {
        this.aspirantesBuscar = res['result']
      }
    })

  }


}
