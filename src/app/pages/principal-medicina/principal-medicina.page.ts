import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormValidarMediComponent } from '../../componentes/form-validar-medi/form-validar-medi.component';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-principal-medicina',
  templateUrl: './principal-medicina.page.html',
  styleUrls: ['./principal-medicina.page.scss'],
})

export class PrincipalMedicinaPage implements OnInit {

  hidden = false;

  private aspirantesNuevo = []
  estados: any = [];
  estado: any = {};

  private listaTareas = []
  textobusqueda = ""

  listamenu = []
  numNotificaciones = 0;

  contPagina = 0;
  numPaginas = 1;
  loadingData = false;
  loadingList = [1, 1, 1, 1, 1, 1];
  showHistorial = false;

  private subscription: Subscription;

  constructor(
    private dataService: DataService,
    private actionSheetCtr: ActionSheetController,
    private modalController: ModalController,
    private servicioFtp: FtpfilesService,

  ) {

    if (this.loadingData) {
      //this.dataService.mostrarLoading(this.dataService.loading)
      //dataService.mostrarLoading$.emit(true)
    }
    //else
    //this.dataService.cerrarLoading( dataService.loading )

  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }


  ngOnInit() {

    //this.setInitData();

  }

  ionViewWillEnter() {

    //if( this.dataService.isloading == false ) this.dataService.mostrarLoading( );

    this.dataService.mostrarLoading$.emit(true)
    this.setInitData();

    this.dataService.setSubmenu('Departamento Medico');
    if (this.listaTareas.length == 0) {
      this.contPagina = 0;
    } else {
      this.dataService.mostrarLoading$.emit(false)
    }
  }

  ionViewWillLeave() {
    //this.subscription.unsubscribe();
    //console.log("unsubscribe() **MEDI")
  }

  ngOnDestroy() {
  }


  async setInitData() {

    if (this.dataService.estados.length > 0) {
      this.estados = this.dataService.estados;
      this.estado = this.estados[0];
      this.listarAspirantes({ detail: { value: 0 } })
    } else {
      //console.log('NO Data')
      setTimeout(() => {
        this.setInitData();
      }, 1000);
    }

  }

  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }

  listarAspirantes(event?, historial = false) {

    this.loadingList = [1, 1, 1, 1, 1, 1];
    this.loadingData = true;
    this.listaTareas = [];
    this.aspirantesNuevo = [];
    this.contPagina = 0;
    let id;

    this.showHistorial = (historial==true)?true:false;

    if (event.est_id || event.est_id == 0) {
      id = parseInt(event.est_id);
    } else {

      if (!isNaN(parseFloat(event.detail.value)) && !isNaN(event.detail.value - 0)) {
        id = parseInt(event.detail.value);
      } else {
        id = parseInt(event.detail.value.estados[0].est_id);
      }

    }


    //const id = (event) ? event.detail.value : 0
    this.estado = id;

    let est_color = "#2fdf75";

    if (id == 0) {
      //this.numNotificaciones = this.listaTareas.length
    } else if (id == 1) {
      est_color = "#3171e0"
    } else if (id == 2) {
      est_color = "#eb445a"
    }

    this.listaTareas = this.dataService.dataLocal.filterEstado('medi', id, historial);
    if (this.estado == 0) {
      this.numNotificaciones = this.listaTareas.length
    }
    const numCards = (this.listaTareas.length > 5) ? 1 : 6 - this.listaTareas.length;

    //console.log(this.estado, 'medi', id, this.listaTareas)
    // console.log("** LOCAL ** ", numCards, this.listaTareas.length, departamento, id, historial)


    if (numCards > 0) {
      // if (id == 0) {
      this.aspirantesNuevo = this.listaTareas.slice(0, 5);
      // }

      //this.loadingData = false;
    }

    this.loadingList = [];

    for (let index = 0; index < numCards; index++) {
      this.loadingList.push(1);
    }

    this.subscription = this.dataService.listadoPorDepartamento('medi', id).subscribe(res => {
      //console.log(event, this.estado, historial, res)

      if (this.estado == 0) {
        //console.log(id, event, this.estado)
        this.numNotificaciones = this.listaTareas.length
      }
      if (res.aspirantes.length == 0) {
        setTimeout(() => {
          this.loadingData = false;
          this.aspirantesNuevo = this.listaTareas.slice(0, 6);
        }, 1000);
        return
      }

      res['aspirantes'].forEach(element => {

        element = { ...element, est_color }
        //this.listaTareas.push(element)

      });

      this.numPaginas = Math.ceil(res['aspirantes'].length / 6) || 1;

      this.listaTareas = res['aspirantes'];
      this.loadingData = false;

      //this.estado.selected = id;
      this.aspirantesNuevo = this.listaTareas.slice(0, 6);

      //}

      //console.log(id)
      if (id == 0) {
        this.numNotificaciones = this.listaTareas.length
      }

      //this.dataService.cerrarLoading()
      this.dataService.mostrarLoading$.emit(false);
      this.quitarSubscripcion();

    })

  }

  quitarSubscripcion() {
    this.subscription.unsubscribe()
  }

  updatePagina(value) {
    this.contPagina = this.contPagina + value;
    //console.log(this.contPagina*4,(this.contPagina+1)*4)
    this.aspirantesNuevo = this.listaTareas.slice(this.contPagina * 6, (this.contPagina + 1) * 6);
  }


  async opcionesTarea(aspirante) {

    //this.dataService.aspOpciones$.unsubscribe();

    const apto = (aspirante.asp_estado == 'NO APTO') ? false : true;
    // const x = this.dataService.getItemOpciones(aspirante)
    this.dataService.getItemOpciones(aspirante, 'medi').then((res) => {
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

  async abrirFormmedi(aspirante) {

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarMediComponent,
      cssClass: 'my-modal-class',
      componentProps: {
        aspirante: objAspirante,
        rol: 'medi',
        objModal: this.modalController
      }
    });

    await modal.present();

    //const { data } = await modal.onDidDismiss();
    const { data } = await modal.onWillDismiss();
    //console.log(data)

    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

    //data.aspirante.asp_estado = "APROBADO"
    this.dataService.mostrarLoading();

    this.dataService.verifyMedicina(data.aspirante).subscribe(res => {

      if (res['success'] == true) {

        if (data.ficha != null) {
          this.servicioFtp.uploadFile(data.ficha).subscribe(res2 => {
            res = res2;
            this.dataService.cerrarLoading();
          })
        }

        this.numNotificaciones--;

        this.listaTareas.forEach((element, index) => {
          if (element.asp_cedula == aspirante.amv_aspirante) {
            this.listaTareas.splice(index, 1);
            this.contPagina = 0;
            this.aspirantesNuevo = this.listaTareas.slice(0, 6);
            this.dataService.presentAlert("VALIDACION COMPLETA", "La información del aspirante has sido ingresada exitosamente.")
          }
        });

      }

      this.dataService.cerrarLoading();

    })

  }

  mostrarHistorial(evento) {
    // if(evento.detail.checked){
    //this.showHistorial = evento.detail.checked;
    //console.log(this.showHistorial, evento)
    if (this.loadingData == true) return
    this.listarAspirantes({ detail: { value: this.estado } }, evento.detail.checked)
    // }
  }


}