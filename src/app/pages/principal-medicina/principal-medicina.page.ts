import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FormValidarMediComponent } from '../../componentes/form-validar-medi/form-validar-medi.component';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';


@Component({
  selector: 'app-principal-medicina',
  templateUrl: './principal-medicina.page.html',
  styleUrls: ['./principal-medicina.page.scss'],
})

export class PrincipalMedicinaPage implements OnInit {

  aspirantesNuevo = [];
  estado = 3;

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
    private modalController: ModalController,
    private servicioFtp: FtpfilesService,
  ) {


  }


  ngOnInit() {

    this.dataService.servicio_listo = true;
    this.dataService.mostrarLoading$.emit(true)

    this.dataService.aspirantes$.subscribe(resp => {
      if (resp == true) {
        const listaFiltrada = this.dataService.filterAspirantes('medi', this.estado, this.showHistorial).aspirantes;
        this.listaTareas = this.formatAspirantes(listaFiltrada);
        this.setAspirantesData(true)
      }
      this.stopLoading();

    });

    this.setInitData();

  }


  ionViewWillEnter() {
    this.dataService.setSubmenu('Departamento Medico');
    this.contPagina = 0;
  }


  ionViewWillLeave() {
  }


  ngOnDestroy() {
  }


  async setInitData() {
    this.listarAspirantes(this.estado);
  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  listarAspirantes(estado?) {

    const aspirantes = this.dataService.filterAspirantes('medi', estado, this.showHistorial).aspirantes;
    this.aspirantesNuevo = [];
    this.contPagina = 0;

    this.timeoutId = setTimeout(() => {
      //console.log("STOP **loading data", "   time up: ", 5, "seg");
      this.stopLoading()
    }, 8000)

    if (estado == 0) {
      this.showHistorial = false;
    }

    this.estado = estado;
    this.listaTareas = this.formatAspirantes(aspirantes);

    const numCards = (aspirantes.length > 5) ? 1 : 6 - this.listaTareas.length;

    for (let index = 0; index < numCards; index++) {
      this.loadingList.push(1 + index);
    }

    this.loadingData = true;

    if (numCards > 0) {
      this.numNotificaciones = (estado == 3) ? this.listaTareas.length : this.numNotificaciones;
      this.aspirantesNuevo = this.listaTareas.slice(0, 5);
      this.numPaginas = Math.ceil(this.listaTareas.length / 6) || 1;
    }

    this.setAspirantesData();
    this.dataService.getAspirantesApi();

  }


  stopLoading() {
    // //console.log("Timer @@@ --> ", this.timeoutId)
    clearTimeout(this.timeoutId)
    setTimeout(() => {
      this.dataService.mostrarLoading$.emit(false)
      this.loadingData = false;
      this.loadingList = [];
      this.aspirantesNuevo = this.listaTareas.slice(0, 6);
    }, 500);

  }


  formatAspirantes(aspirantes) {
    let est_color = "#2fdf75";
    const lista_update = JSON.parse(JSON.stringify(aspirantes)) ;

    if (this.estado == 4) {
      est_color = "#3171e0"   //Aprobado
    } else if(this.estado == 5) {
      est_color = "#eb445a"   //NO arobado
    }
    lista_update.forEach(element => {
      element.est_color = est_color;
    });
    return lista_update;
  }


  setAspirantesData(fromApi = false) {
    const id = this.estado;

    if (id == 3) {
      this.numNotificaciones = this.listaTareas.length
    }

    this.numPaginas = Math.ceil(this.listaTareas.length / 6) || 1;

    if (fromApi) {
      // console.log("GET Api <<< ", { fromApi })
      clearTimeout(this.timeoutId)
    }

  }


  updatePagina(value) {
    this.contPagina = this.contPagina + value;
    //console.log(this.contPagina*4,(this.contPagina+1)*4)
    this.aspirantesNuevo = this.listaTareas.slice(this.contPagina * 6, (this.contPagina + 1) * 6);
  }


  async opcionesTarea(aspirante) {

    // const apto = (aspirante.asp_estado == 4) ? false : true;
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

    const { data } = await modal.onWillDismiss();


    if (!data || data == undefined || data.role == "cancelar") {
      return;
    }

    //data.aspirante.asp_estado = "APROBADO"
    this.dataService.mostrarLoading();
    console.log(data);
    
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


  mostrarHistorial() {
    this.showHistorial = (this.showHistorial) ? false : true;
    this.listarAspirantes(this.estado)
    // }
  }

}