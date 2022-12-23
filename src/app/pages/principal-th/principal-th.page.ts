import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { Router } from '@angular/router';
import { FormValidarTthhComponent } from '../../componentes/form-validar-tthh/form-validar-tthh.component';
import { FormValidarPsicoComponent } from '../../componentes/form-validar-psico/form-validar-psico.component';
import { FormValidarMediComponent } from '../../componentes/form-validar-medi/form-validar-medi.component';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-principal-th',
  templateUrl: './principal-th.page.html',
  styleUrls: ['./principal-th.page.scss'],
})
export class PrincipalThPage implements OnInit {

  private aspirantesNuevo = []
  private estados: any = [];
  private estado: any = {};

  private listaTareas = []
  textobusqueda = ""

  numNotificaciones = 0;

  contPagina = 0;
  numPaginas = 1;
  loadingData = true;
  loadingList = [1, 1, 1, 1, 1, 1];
  showHistorial = false;

  private subscription: Subscription;

  constructor(
    private dataService: DataService,
    private actionSheetCtr: ActionSheetController,
    private router: Router,
    public modalController: ModalController,
    private alertCtrl: AlertController,

  ) {

    if (this.loadingData) {
      //this.dataService.mostrarLoading(this.dataService.loading)
      //dataService.mostrarLoading$.emit(true)
    }
    //else
    //this.dataService.cerrarLoading( dataService.loading )

  }

  ngOnInit() {

    //this.setInitData();

  }

  ionViewWillEnter() {

    this.dataService.mostrarLoading$.emit(true)
    this.setInitData();

    this.dataService.setSubmenu('Talento Humano');
    if (this.listaTareas.length == 0) {
      //this.listarAspirantes({ detail: { value: this.estado.selected } });
      // this.setEstado({ detail: { value: this.estado.id } });
      this.contPagina = 0;
    } else {
      this.dataService.mostrarLoading$.emit(false)
    }

  }

  ionViewWillLeave() {
    // console.log("ionViewWillLeave **TTHH")
    //this.subscription.unsubscribe();
    //console.log(this.estado)

  }

  ngOnDestroy() {
  }


  async setInitData() {

    if (this.listaTareas.length > 0) {
      return
    }
    if (this.dataService.estados.length > 0) {
      this.estados = this.dataService.estados;
      this.estado = this.estados[0];
      //console.log('TTHH -> setInitData', this.dataService.estados, this.estado)
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

    //this.dataService.mostrarLoading( )
    //console.log(this.estado)

    this.loadingList = [1, 1, 1, 1, 1, 1];
    this.loadingData = true;
    this.listaTareas = [];
    this.aspirantesNuevo = [];
    this.contPagina = 0;
    let id;

    this.showHistorial = (historial == true) ? true : false;

    if (event.est_id || event.est_id == 0) {
      id = parseInt(event.est_id);
    } else {

      if (!isNaN(parseFloat(event.detail.value)) && !isNaN(event.detail.value)) {
        id = parseInt(event.detail.value);
      } else {
        id = parseInt(event.detail.value.estados[0].est_id);
      }

    }

    let departamento = 'tthh';
    this.estado.selected = id
    //console.log(this.estado, departamento, id, "Loading** ", this.loadingData)
    this.listaTareas = this.dataService.dataLocal.filterEstado(departamento, id, historial);
    const numCards = (this.listaTareas.length > 5) ? 1 : 6 - this.listaTareas.length;

    if (numCards > 0) {
      // if (id == 0) {
      this.numNotificaciones = (id == 0) ? this.listaTareas.length : this.numNotificaciones;
      this.aspirantesNuevo = this.listaTareas.slice(0, 5);
      this.numPaginas = Math.ceil(this.listaTareas.length / 6) || 1;
      // }
      //this.loadingData = false;
    }

    this.loadingList = [];

    for (let index = 0; index < numCards; index++) {
      this.loadingList.push(1);
    }

    this.subscription =
      this.dataService.listadoPorDepartamento(departamento, id, historial).subscribe(res => {


        if (this.estado.selected == 0) {
          //console.log(id, event, this.estado)
          this.numNotificaciones = this.listaTareas.length
        }
        if (res.aspirantes.length == 0) {
          setTimeout(() => {
            this.loadingData = false;
            this.aspirantesNuevo = this.listaTareas.slice(0, 6);
            this.dataService.mostrarLoading$.emit(false)
          }, 1000);
          return
        }

        res['aspirantes'].forEach(element => {
          if (element.asp_estado == 'NO APROBADO') {
            element.asp_colorestado = "danger"
          } else if (element.asp_estado == 'VERIFICADO') {
            element.asp_colorestado = "success"
          } else {
            element.asp_colorestado = "primary"
          }
        });

        this.numPaginas = Math.ceil(res['aspirantes'].length / 6) || 1;

        setTimeout(() => {
          this.loadingData = false;
          this.loadingList = [];
          this.listaTareas = res['aspirantes'];
          this.aspirantesNuevo = this.listaTareas.slice(0, 6);
        }, 1000);

        //console.log(id, this.estado.id, departamento)

        if (id == 0) {
          this.numNotificaciones = this.listaTareas.length
        }


        //console.log(res['aspirante'])
        //resolve(true);
        this.dataService.mostrarLoading$.emit(false)

        this.quitarSubscripcion();

      });


  }

  quitarSubscripcion() {
    this.subscription.unsubscribe()
  }

  setEstado(event) {

    this.estados = JSON.parse(JSON.stringify(this.dataService.estados));
    this.estados.forEach(e => {
      if (e['id'] === event.detail.value) {
        this.estado = e;
        if (e['id'] == 20) {
          event.detail.value = 4
        }
        if (e['id'] == 30) {

        }
        if (e['id'] == 40) {

        }
        if (e['id'] == 50) {
          //this.estado.estados.shift();
          //event = this.estado.estados[0]
        }
        this.estado.selected = event.detail.value || 0;
        this.listarAspirantes(event)
      }

      //this.listarAspirantes({ detail: { value: 0 } })
    });

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

    //this.dataService.aspirante = aspirante;
    return aspirante

    // }, 2000);

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

    const apto = (aspirante.asp_estado == 'NO APTO') ? false : true;
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
          disabled: (id_estado < 2) ? true : false
        },
        {
          label: 'Verificacion de psicologia',
          type: 'radio',
          value: '3',
          disabled: (id_estado < 4) ? true : false
        },
        {
          label: 'Verificacion de medicina',
          type: 'radio',
          value: '4',
          disabled: (id_estado < 7) ? true : false
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

              this.dataService.getAspirante(aspirante['asp_cedula']).subscribe((data) => {
                //console.log(aspirante, data)
                this.dataService.aspirante = data['result'][0];
                this.router.navigate(['/inicio/tab-aspirante/aspirante-new/' + aspirante['asp_cedula']])

              })

            } else if (res == '2') {

              this.abrirFormalidar(aspirante)

            } else if (res == '3') {

              this.dataService.getAspiranteRole(aspirante['asp_cedula'], 'psico').subscribe(res => {

                this.dataService.aspirante = this.cambiarBool(res['aspirante'])
                aspirante = this.cambiarBool(res['aspirante'])

                //const botones:ActionSheetButton<[]> 
                this.abrirFormpsico(aspirante)
                //this.opcionesTthh1(aspirante)
              })


            } else if (res == '4') {

              this.dataService.getAspiranteRole(aspirante['asp_cedula'], 'medi').subscribe(res => {

                this.dataService.aspirante = this.cambiarBool(res['aspirante'])
                aspirante = this.cambiarBool(res['aspirante'])

                //const botones:ActionSheetButton<[]> 
                this.abrirFormmedi(aspirante)
                //this.opcionesTthh1(aspirante)
              })


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
      data.aspirante.asp_estado = "VERIFICADO"
    } else {
      data.aspirante.asp_estado = "NO APROBADO"
      alertTitle = "ASPIRANTE NO APROBADO"
      alertText = "El asistente NO cumple con la documentacion legal necesaria para continuar en el proceso."
    }

    //return
    //console.log(data)

    this.dataService.verifyTalento(data.aspirante).subscribe((res) => {

      //console.log(res)
      if (res['success'])
        this.dataService.presentAlert(alertTitle, alertText)

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
      asp_estado: "EXAMENES",
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
        this.dataService.presentAlert("AUTORIZACION EXITOSA", "El aspirante has sido autorizado para revision psicologica.")

    })

  }

  autorizarPsicologo(aspirante) {
    //aspirante.task = "actualizar"

    const fecha: Date = new Date()
    const fexamenes = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    const aspPsico = {
      amv_aspirante: aspirante.asp_cedula,
      amv_fexamenes: fexamenes,
      asp_estado: "PSICOLOGIA",
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
        this.dataService.presentAlert("AUTORIZACION EXITOSA", "El aspirante has sido autorizado para revision psicologica.")

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
      this.listarAspirantes()
      if (res['success'])
        this.dataService.presentAlert("VALIDACION COMPLETA", "Se van validado exitosa mento los documentos legales.")
    })
  }

  autorizarContrato(aspirante) {
    const aspTthh = {
      asp_cedula: aspirante.asp_cedula,
      //asp_estado: "APROBADO",
      task: "talentoh3"
    }

    this.dataService.autorizarDocumentacion(aspTthh).subscribe((res) => {
      this.listarAspirantes()
      if (res['success'])
        this.dataService.presentAlert("CONTRATACION EXITOSA", "El proceso de contratacion ha finalizado exitosamente.")
    })

  }


  mostrarHistorial(evento) {
    // console.log(this.estado.selected, evento.detail.checked)
    // if(evento.detail.checked){
    this.listarAspirantes({ est_id: this.estado.selected }, evento.detail.checked)
    // }

  }

}
