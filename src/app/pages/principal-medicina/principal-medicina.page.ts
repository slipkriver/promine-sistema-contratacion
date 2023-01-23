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

  //hidden = false;

  private aspirantesNuevo = [];
  private estado = 0;

  private listaTareas:any[] = []

  textobusqueda = ""

  numNotificaciones = 0;

  contPagina = 0;
  numPaginas = 1;
  loadingData = true;
  loadingList = [1, 2, 3, 4, 5, 6];
  showHistorial = false;
  loadingLocal = false;


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

  }


  ngOnInit() {

    this.dataService.mostrarLoading$.emit(true)
    //this.loadingData = true
    //this.setInitData();

  }

  ionViewWillEnter() {
    // console.log(this.dataService.isloading )
    this.dataService.setSubmenu('Departamento Medico');
    if (this.listaTareas.length == 0) {
      this.listarAspirantes(this.estado);
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


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }

  listarAspirantes(estado?, historial = false) {

    this.loadingList = [1, 2, 3, 4, 5, 6];
    this.loadingData = true;
    this.listaTareas = [];
    this.aspirantesNuevo = [];
    this.contPagina = 0;
    //let estado;

    this.showHistorial = (historial == true) ? true : false;

    if (estado || estado == 0) {
      estado = parseInt(estado);
    } else {
      estado = 0;
    }


    //const id = (event) ? event.detail.value : 0
    this.estado = estado;

    let est_color = "#2fdf75";

    if (estado == 0) {
      //this.numNotificaciones = this.listaTareas.length
    } else if (estado == 1) {
      est_color = "#3171e0"
    } else if (estado == 2) {
      est_color = "#eb445a"
    }

    this.listaTareas = this.dataService.filterAspirantes("medi", estado, historial).aspirantes;
    const numCards = (this.listaTareas.length > 5) ? 1 : 6 - this.listaTareas.length;

    
    console.log(this.numNotificaciones, " ##", numCards, "\n###",estado,this.listaTareas.length);
    if (numCards > 0) {
      // if (id == 0) {
      this.numNotificaciones = (estado == 0) ? this.listaTareas.length : this.numNotificaciones;
      this.aspirantesNuevo = this.listaTareas.slice(0, 5);
      this.numPaginas = Math.ceil(this.listaTareas.length / 6) || 1;
      // }
      //this.loadingData = false;
    }

    this.loadingList = [];

    for (let k = 0; k < numCards; k++) {
      this.loadingList.push(1+k);
    }

    this.dataService.listadoPorDepartamento('medi', estado, historial).then(res => {
      
      const aspirantes = res['aspirantes'];
      if (aspirantes.length>=0) {
        setTimeout(() => {
          this.loadingData = false;
          //console.log("loading data",this.loadingData," --->>>> ", estado, res['aspirantes'].length)
          this.aspirantesNuevo = this.listaTareas.slice(0, 6);
        }, 1000);
        ///return
      }

      aspirantes.forEach(element => {

        element = { ...element, est_color }
        //this.listaTareas.push(element)

      });

      this.numPaginas = Math.ceil(aspirantes.length / 6) || 1;

      this.listaTareas = aspirantes;
      //this.loadingData = false;

      //this.estado.selected = id;
      this.aspirantesNuevo = this.listaTareas.slice(0, 6);

      //}

      //console.log(estado)
      if (estado == 0) {
        this.numNotificaciones = this.listaTareas.length
      }

      //this.dataService.cerrarLoading()
      this.dataService.mostrarLoading$.emit(false);

    })

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



  mostrarHistorial(evento) {
    if (this.loadingData == true) return
    this.listarAspirantes( this.estado, evento.detail.checked)
    // }
  }

}