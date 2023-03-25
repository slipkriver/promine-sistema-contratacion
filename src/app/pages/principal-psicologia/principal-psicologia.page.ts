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
    this.dataService.servicio_listo = true;
    this.dataService.mostrarLoading$.emit(true)

    this.dataService.aspirantes$.subscribe(resp => {
      if (resp == true) {
        const listaFiltrada = this.dataService.filterAspirantes('psico', this.estado, this.showHistorial).aspirantes;
        this.listaTareas = this.formatAspirantes(listaFiltrada);
        this.setAspirantesData(true)
      }

      this.stopLoading();

    });

    this.setInitData();

  }

  ionViewWillEnter() {
    //this.dataService.mostrarLoading$.emit(true)
    this.dataService.setSubmenu('Psicologia');
    this.contPagina = 0;

  }


  async setInitData() {
    this.listarAspirantes(this.estado);
    // this.listarAspirantes({ est_id: 0 });
  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  listarAspirantes(estado?) {

    const aspirantes = this.dataService.filterAspirantes('psico', estado, this.showHistorial).aspirantes;
    this.aspirantesNuevo = [];
    this.contPagina = 0;

    this.timeoutId = setTimeout(() => {
      //console.log("STOP **loading data", "   time up: ", 5, "seg");
      this.stopLoading()
    }, 8000)
    //let estado;

    if (estado == 4) {
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
    const lista_update = JSON.parse(JSON.stringify(aspirantes));

    if (this.estado == 6) {
      est_color = "#3171e0"   //Aprobado
    } else if (this.estado == 5) {
      est_color = "#eb445a"   //NO arobado
    }
    lista_update.forEach(element => {
      element.est_color = est_color;
    });
    return lista_update;
  }

  setAspirantesData(fromApi = false) {
    const id = this.estado;

    if (id == 4) {
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

    //this.dataService.aspOpciones$.unsubscribe();

    // const apto = (aspirante.asp_estado == 6) ? false : true;
    // const x = this.dataService.getItemOpciones(aspirante)
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


  async opcionesPsico1(aspirante) {

    var strTitulo = aspirante.asp_nombre
    const opciones = await this.actionSheetCtr.create({
      header: strTitulo,
      cssClass: 'action-sheet-th',
      buttons: [
        {
          text: 'Verificar pruebas psicosometricas',
          icon: 'checkmark-circle',
          handler: async () => {
            setTimeout(() => {

              this.abrirFormpsico(aspirante)

            }, 1000);
            //console.log(aspirante);
          },
        },
        {
          text: 'Ver informacion del apirante ',
          icon: 'information-circle-outline',
          handler: () => {

            //this.dataService.getAspirante(aspirante['asp_cedula']).subscribe((data) => {
            //console.log(aspirante, data)
            //this.dataService.aspirante = data['result'][0];
            this.router.navigate(['/inicio/tab-aspirante/aspirante-new/' + aspirante['asp_cedula']])

            //})
            //console.log('/pages/aspirante-new/' + aspirante['asp_cedula']);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          cssClass: 'rojo',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await opciones.present();

    const { role } = await opciones.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);
  }


  async opcionesPsico2(aspirante) {

    var strTitulo = aspirante.asp_nombre
    const opciones = await this.actionSheetCtr.create({
      header: strTitulo,
      cssClass: 'action-sheet-th',
      buttons: [
        {
          text: 'Ver certificado de aptitud',
          icon: 'checkmark-circle',
          handler: async () => {
            setTimeout(() => {

              this.abrirFormpsico(aspirante)

            }, 1000);
            //console.log(aspirante);
          },
        },
        {
          text: 'Descargar certificado de aptitud',
          icon: 'cloud-download-outline',
          cssClass: '',
          handler: async () => {
            this.dataService.mostrarLoading()
            setTimeout(() => {

              this.servicioPdf.getPdfFichapsicologia(aspirante).then(() => this.dataService.cerrarLoading())
              //console.log(aspirante)

            }, 1000);
            //console.log(aspirante);
          },
        },
        {
          text: 'Ver informacion del apirante ',
          icon: 'information-circle-outline',
          handler: () => {

            //this.dataService.getAspirante(aspirante['asp_cedula']).subscribe(res => {
            //console.log(res)
            //this.dataService.aspirante = res['result'][0];
            this.router.navigate(['/inicio/tab-aspirante/aspirante-new/' + aspirante['asp_cedula']])

            //})
            //console.log('/pages/aspirante-new/' + aspirante['asp_cedula']);
          },
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel',
          cssClass: 'rojo',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await opciones.present();

    const { role } = await opciones.onDidDismiss();
    //console.log('onDidDismiss resolved with role', role);
  }


  setEstado(evento) {
    // console.log(evento)
    //this.estado = evento.detail.value
    this.listarAspirantes(evento)
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

    //return;
    // if (data.length>0) {
    data.aspirante.task = "actualizar"

    this.dataService.verifyPsicologia(data.aspirante).subscribe(res => {

      // console.log(res)
      if (res['success'] == true) {

        if (data.ficha != null) {
          this.servicioFtp.uploadFile(data.ficha).subscribe(res2 => {
            res = res2
            if (!data.test) this.dataService.cerrarLoading()
          })
        }

        if (data.test != null) {
          this.servicioFtp.uploadFile(data.test).subscribe(res2 => {
            res = res2
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
