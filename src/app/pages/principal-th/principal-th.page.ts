import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';

import { FormValidarTthhComponent } from '../../componentes/form-validar-tthh/form-validar-tthh.component';
import { FormValidarPsicoComponent } from '../../componentes/form-validar-psico/form-validar-psico.component';
import { FormValidarMediComponent } from '../../componentes/form-validar-medi/form-validar-medi.component';


@Component({
  selector: 'app-principal-th',
  templateUrl: './principal-th.page.html',
  styleUrls: ['./principal-th.page.scss'],
})

export class PrincipalThPage implements OnInit {

  aspirantesNuevo = []
  estados: any = [];
  estado: any = {};

  listaTareas: any[] = []
  textobusqueda = ""

  numNotificaciones = 0;

  contPagina = 0;
  numPaginas = 1;
  loadingData = true;
  loadingList = [];
  showHistorial = false;
  loadingLocal = false;
  timeoutId: NodeJS.Timeout;


  constructor(
    private dataService: DataService,
    private actionSheetCtr: ActionSheetController,
    private router: Router,
    public modalController: ModalController,
    private alertCtrl: AlertController,

  ) {


  }


  ngOnInit() {

    this.dataService.servicio_listo = true;
    this.dataService.mostrarLoading$.emit(true)

    this.dataService.aspirantes$.subscribe(resp => {
      if (resp == true) {
        const listaFiltrada = this.dataService.filterAspirantes('tthh', this.estado.selected, this.showHistorial).aspirantes;
        this.listaTareas = this.formatAspirantes(listaFiltrada);
        this.setAspirantesData(true)
      }
      this.stopLoading();

    });

    this.setInitData();

  }


  ionViewWillEnter() {
    this.dataService.setSubmenu('Talento Humano');
    this.contPagina = 0;
  }


  ionViewWillLeave() {
  }


  ngOnDestroy() {
  }


  async setInitData() {
    this.estados = this.dataService.estados;
    this.estado = this.estados[0];
    this.estado.selected = 0;

    this.listarAspirantes(0);
  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  async listarAspirantes(estado) {

    const aspirantes = this.dataService.filterAspirantes('tthh', estado, this.showHistorial).aspirantes;
    this.aspirantesNuevo = [];
    this.contPagina = 0;

    this.timeoutId = setTimeout(() => {
      //console.log("STOP **loading data", "   time up: ", 5, "seg");
      this.stopLoading()
    }, 8000)

    if (estado == 0) {
      this.showHistorial = false;
    }

    this.estado.selected = estado
    //this.listaTareas = []
    this.listaTareas = (estado == 0) ? aspirantes: this.formatAspirantes(aspirantes);
    //console.log(aspirantes, this.listaTareas)

    const numCards = (this.listaTareas.length > 5) ? 1 : 6 - this.listaTareas.length;

    for (let index = 0; index < numCards; index++) {
      this.loadingList.push(1 + index);
    }

    this.loadingData = true;

    if (numCards > 0) {
      this.numNotificaciones = (estado == 0) ? this.listaTareas.length : this.numNotificaciones;
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
    const colores_ok = [1, 3, 4, 6, 7, 9, 10, 12, 13, 15, 16];
    const colores_no = [2, 5, 8, 11, 14];
    const lista_update = JSON.parse(JSON.stringify(aspirantes)) ;
    
    if (colores_ok.includes(this.estado.selected)) {
      est_color = "#3171e0";
    }
    if (colores_no.includes(this.estado.selected)) {
      est_color = "#eb445a";
    }
    console.log(est_color, this.estado.selected);
    if (this.estado.selected == 0)
      return lista_update;
    else {
      lista_update.forEach(element => {
        element.est_color = est_color;
      });
      return lista_update;
    }
  }


  setAspirantesData(fromApi = false) {
    //this.estado.selected = id;
    const id = this.estado.selected;
    //this.listaTareas = aspirantes;

    //const aspirantes = res['aspirantes'];
    if (id == 0) {
      this.numNotificaciones = this.listaTareas.length
    }

    this.numPaginas = Math.ceil(this.listaTareas.length / 6) || 1;

    // setTimeout(() => {
    if (fromApi) {
      // console.log("GET Api <<< ",{fromApi})
      clearTimeout(this.timeoutId)
    }

  }


  setEstado(event) {

    //console.log(event.detail, this.estado);
    this.estados.forEach(e => {
      if (e['id'] === event.detail.value) {
        this.estado = e;
        //this.estado.selected = event.detail.value || 0;
      }

    });

    //console.log(event.detail.value, this.estado);
    this.listarAspirantes(this.estado.selected)

  }


  updatePagina(value) {
    this.contPagina = this.contPagina + value;
    //console.log(this.contPagina*4,(this.contPagina+1)*4)
    this.aspirantesNuevo = this.listaTareas.slice(this.contPagina * 6, (this.contPagina + 1) * 6);
  }


  cambiarBool(aspirante) {

    (Object.keys(aspirante) as (keyof typeof aspirante)[]).forEach((key, index) => {
      if (aspirante[key] == "true") {
        aspirante[key] = true
        // console.log(key, aspirante[key], index);
      } else if (aspirante[key] == "false") {
        aspirante[key] = false
        // console.log(key, aspirante[key], index);
      }
      // 👇️ name Tom 0, country Chile 1
    })

    return aspirante

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


  async opcionesTarea(aspirante) {

    //const apto = (aspirante.asp_estado == 'NO APTO') ? false : true;
    // const x = this.dataService.getItemOpciones(aspirante)
    this.dataService.getItemOpciones(aspirante).then((res) => {
      //console.log(res);
      this.mostrarOpciones(res['aspirante'], res['botones'])
    })

  }


  async selectDocumentos(id_estado, aspirante) {
    //console.log(id_estado)

    const alert = await this.alertCtrl.create({
      header: 'Aceptar',
      message: '<strong>Seleccione un elemento para su revision.</strong>!!!',
      inputs: [
        {
          label: 'Ver ficha de ingreso',
          type: 'radio',
          value: '1',
        },
        {
          label: 'Ficha de validacion tthh',
          type: 'radio',
          value: '2',
          disabled: (id_estado == 1) ? true : false
        },
        {
          label: 'Verificacion de medicina',
          type: 'radio',
          value: '3',
          disabled: (id_estado < 4) ? true : false
        },
        {
          label: 'Verificacion de psicologia',
          type: 'radio',
          value: '4',
          disabled: (id_estado < 6) ? true : false
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            //console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: (res) => {

            if (res == '1') {

              //this.dataService.setAspirante(aspirante['asp_cedula']).subscribe((data) => {
              //console.log(aspirante, data)
              //this.dataService.aspirante = data['result'][0];
              this.router.navigate(['/inicio/tab-aspirante/aspirante-new/' + aspirante['asp_cedula']])

              //})

            } else if (res == '2') {

              this.abrirFormalidar(aspirante)

            } else if (res == '3') {

              this.dataService.aspirante = this.cambiarBool(res['aspirante'])
              aspirante = this.cambiarBool(res['aspirante'])
              this.abrirFormmedi(aspirante)

            } else if (res == '4') {

              this.dataService.aspirante = this.cambiarBool(res['aspirante'])
              aspirante = this.cambiarBool(res['aspirante'])

              this.abrirFormpsico(aspirante)

            }

          }
        }
      ]
    });

    await alert.present();
  }

  borrarBusqueda() {
    this.textobusqueda = ""
    //this.aspirantesNuevo = []
    //console.log(this.aspirantesNuevo)
  }




  async abrirFormalidar(aspirante) {

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarTthhComponent,
      cssClass: 'my-modal-class',
      componentProps: {
        aspirante: objAspirante
      }
    });

    setTimeout(() => {
      modal.present();
    }, 500);

    const { data } = await modal.onDidDismiss();
    if (!data || data == undefined || data.role == "cancelar") {
      modal.dismiss()
      return;
    }

    let alertTitle = "AUTORIZACION EXITOSA"
    let alertText = "El aspirante has sido autorizado para realizar los examenes medicos."

    data.aspirante.task = "actualizar"
    data.aspirante.atv_verificado = true

    if (data.aspirante.atv_aprobado == "SI") {
      data.aspirante.asp_estado = 3;
    } else {
      data.aspirante.asp_estado = 2;
      alertTitle = "ASPIRANTE NO APROBADO"
      alertText = "El asistente NO cumple con la documentacion legal necesaria para continuar en el proceso."
    }

    //return
    //console.log(data)

    this.dataService.verifyTalento(data.aspirante).subscribe((res) => {

      //console.log(res)
      if (res['success'])
        this.dataService.presentAlert(alertTitle, alertText, "alertExamenes")

      this.listaTareas.forEach((element, index) => {
        if (element.asp_cedula == data.aspirante.asp_cedula) {
          this.listaTareas.splice(index, 1)
          this.contPagina = 0;
          this.aspirantesNuevo = this.listaTareas.slice(0, 6);
          //console.log(element,index,data.aspirante,this.listaTareas)
        }
      });
      this.numNotificaciones--;
    })
    // }
  }


  async abrirFormpsico(aspirante) {

    const objAspirante = JSON.parse(JSON.stringify(aspirante))
    //console.log(aspirante, objAspirante)
    const modal = await this.modalController.create({
      component: FormValidarPsicoComponent,
      cssClass: 'my-modal-class',
      componentProps: {
        aspirante: objAspirante,
        rol: 'tthh'
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data || data == undefined || data.role == "cancelar") {
      //console.log(data);
      //objAspirante = ''
      modal.dismiss()
      return;
    }

    data.aspirante.atv_verificado = true

    data.aspirante.task = "actualizar"
    this.dataService.verifyTalento(data.aspirante).subscribe(res => {
      console.log(res)
      // this.dataService.cerrarLoading()
    })
    // }
  }

  async abrirFormmedi(aspirante) {

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarMediComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        aspirante: objAspirante,
        rol: 'tthh'
      }
    });
    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data || data == undefined || data.role == "cancelar") {
      //console.log(data);
      //objAspirante = ''
      modal.dismiss()
      return;
    }

    data.aspirante.atv_verificado = true

    data.aspirante.task = "actualizar"
    this.dataService.verifyTalento(data.aspirante).subscribe(res => {
      console.log(res)
      // this.dataService.cerrarLoading()
    })
    // }
  }


  async mostrarAlerMedicina(aspirante) {
    //console.log('Alert GUARDAR', aspirante);

    const alert = await this.alertCtrl.create({
      header: 'Autorizacion de examenes ocupacionales',

      //subHeader: 'El aspirante ya se escuentra ingresado en el sistema',
      message: "<p>¿Estas seguro de autorizar al aspirante para que proceda a realizar los examenes ocupacionales?</p>" +
        "<ion-item > <ion-icon name='help-circle'  >" +
        "</ion-icon> <ion-label >Cedula: <b>" + aspirante["asp_cedula"] + "<br>" + aspirante["asp_nombre"] + "</b>" +
        "</ion-label></ion-item>",
      cssClass: 'alertExamenes',
      buttons: [
        {
          text: 'Cancelar',
          role: 'calcel',
        },
        {
          text: 'Autorizar',
          role: 'ok',
          cssClass: 'btnAlerAceptar',
          handler: () => {
            this.autorizarExamenes(aspirante)
          }
        }
      ]
    });
    await alert.present()
  }

  async mostrarAlerPsicologia(aspirante) {
    const alert = await this.alertCtrl.create({
      header: 'Autorizacion consulta Psicologia',
      //subHeader: 'El aspirante ya se escuentra ingresado en el sistema',
      message: "<p>¿El aspirante cumple con todos los requisitos y puede procedera la consulta con el psicologo?</p>" +
        "<ion-item > <ion-icon name='help-circle'  >" +
        "</ion-icon> <ion-label >Cedula: <b>" + aspirante["asp_cedula"] + "<br>" + aspirante["asp_nombre"] + "</b>" +
        "</ion-label></ion-item>",
      cssClass: 'alertExamenes',
      buttons: [
        {
          text: 'Cancelar',
          role: 'calcel',
          cssClass: 'btnAlertCancelar'
        },
        {
          text: 'Autorizar',
          role: 'ok',
          cssClass: 'btnAlerAceptar',
          handler: () => {
            //console.log('Alert GUARDAR');
            this.autorizarPsicologo(aspirante)
          }
        }
      ]
    });
    await alert.present()
  }

  autorizarExamenes(aspirante) {
    //aspirante.task = "actualizar"

    const fecha: Date = new Date()
    const fexamenes = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    const aspMedico = {
      amv_aspirante: aspirante.asp_cedula,
      amv_fexamenes: fexamenes,
      asp_estado: 3,
      task: "autorizarex"
    }

    //console.log(aspMedico)

    this.dataService.autorizarExocupacion(aspMedico).subscribe(res => {

      this.listaTareas.forEach((element, index) => {
        if (element.asp_cedula == aspMedico.amv_aspirante) {
          this.listaTareas.splice(index, 1)
          this.contPagina = 0;
          this.aspirantesNuevo = this.listaTareas.slice(0, 6);
          //console.log(element,index,data.aspirante,this.listaTareas)
        }
      });

      this.numNotificaciones--;

      if (res['success'])
        this.dataService.presentAlert("AUTORIZACION EXITOSA", "El aspirante has sido autorizado para revision psicologica.", "alertExamenes")

    })

  }

  autorizarPsicologo(aspirante) {
    //aspirante.task = "actualizar"

    const fecha: Date = new Date()
    const fexamenes = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    const aspPsico = {
      amv_aspirante: aspirante.asp_cedula,
      amv_fexamenes: fexamenes,
      asp_estado: 6,
      task: "psicologia2"
    }

    console.log(aspPsico)

    this.dataService.autorizarPsicologia(aspPsico).subscribe(res => {

      this.listaTareas.forEach((element, index) => {
        if (element.asp_cedula == aspPsico.amv_aspirante) {
          this.listaTareas.splice(index, 1)
          this.contPagina = 0;
          this.aspirantesNuevo = this.listaTareas.slice(0, 6);
          //console.log(element,index,data.aspirante,this.listaTareas)
        }
      });

      this.numNotificaciones--;
      //console.log(res)
      if (res['success'])
        this.dataService.presentAlert("AUTORIZACION EXITOSA", "El aspirante has sido autorizado para revision psicologica.", "alertExamenes")

    })

  }


  async mostrarAlerTthh(aspirante) {
    //console.log(aspirante)
    const alert = await this.alertCtrl.create({
      header: 'Autorizacion de examenes ocupacionales',

      //subHeader: 'El aspirante ya se escuentra ingresado en el sistema',
      message: "<p>¿El aspirante posee toda la documentacion necesaria en regla para proceder con la contratacion?</p>" +
        "<ion-item > <ion-icon name='help-circle'  >" +
        "</ion-icon> <ion-label >Cedula: <b>" + aspirante["asp_cedula"] + "<br>" + aspirante["asp_nombre"] + "</b>" +
        "</ion-label></ion-item>",
      cssClass: 'alertExamenes',
      buttons: [
        {
          text: 'Cancelar',
          role: 'calcel',
        },
        {
          text: 'Confirmar',
          role: 'ok',
          cssClass: 'btnAlerAceptar',
          handler: () => {
            //console.log('Alert GUARDAR', aspirante);
            this.autorizarDocuemntos(aspirante)
          }
        }
      ]
    });
    await alert.present()
  }

  async mostrarAlerTthhFin(aspirante) {
    //console.log(aspirante)
    const alert = await this.alertCtrl.create({
      header: 'Finalización del contrato',

      //subHeader: 'El aspirante ya se escuentra ingresado en el sistema',
      message: "<p>¿Desea finalizar el proceso de contratación?</p>" +
        "<ion-item > <ion-icon name='information-circle'  >" +
        "</ion-icon> <ion-label >Cedula: <b>" + aspirante["asp_cedula"] + "<br>" + aspirante["asp_nombre"] + "</b>" +
        "</ion-label></ion-item>",
      cssClass: 'alertExamenes',
      buttons: [
        {
          text: 'Cancelar',
          role: 'calcel',
        },
        {
          text: 'Confirmar',
          role: 'ok',
          cssClass: 'btnAlerAceptar',
          handler: () => {
            //console.log('Alert GUARDAR', aspirante);
            this.autorizarContrato(aspirante)
          }
        }
      ]
    });
    await alert.present()
  }


  autorizarDocuemntos(aspirante) {
    const aspTthh = {
      asp_cedula: aspirante.asp_cedula,
      //asp_estado: "APROBADO",
      task: "talentoh2"
    }

    this.dataService.autorizarDocumentacion(aspTthh).subscribe((res) => {
      //this.listarAspirantes()
      if (res['success'])
        this.dataService.presentAlert("VALIDACION COMPLETA", "Se van validado exitosa mento los documentos legales.", "alertExamenes")
    })
  }

  autorizarContrato(aspirante) {
    const aspTthh = {
      asp_cedula: aspirante.asp_cedula,
      //asp_estado: "APROBADO",
      task: "talentoh3"
    }

    this.dataService.autorizarDocumentacion(aspTthh).subscribe((res) => {
      //this.listarAspirantes()
      if (res['success'])
        this.dataService.presentAlert("CONTRATACION EXITOSA", "El proceso de contratacion ha finalizado exitosamente.", "alertExamenes")
    })

  }


  mostrarHistorial() {
    //console.log(this.estado.selected, evento.detail.checked)
    // if(evento.detail.checked){
    this.showHistorial = (this.showHistorial) ? false : true;
    this.listarAspirantes(this.estado.selected)
    // }

  }

}
