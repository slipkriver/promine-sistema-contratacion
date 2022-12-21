import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FormValidarPsicoComponent } from '../../componentes/form-validar-psico/form-validar-psico.component';
import { Router } from '@angular/router';
import { ServPdfService } from 'src/app/services/serv-pdf.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-principal-psicologia',
  templateUrl: './principal-psicologia.page.html',
  styleUrls: ['./principal-psicologia.page.scss'],
})

export class PrincipalPsicologiaPage implements OnInit {

  aspirantesBuscar = []
  hidden = false;

  private aspirantesNuevo = []
  private estado = 0;

  private listaTareas = []
  textobusqueda = ""

  listamenu = []
  numNotificaciones = 0;

  contPagina = 0;
  numPaginas = 1;
  loadingData = false;

  private subscription: Subscription;

  constructor(
    private actionSheetCtr: ActionSheetController,
    private dataService: DataService,
    public modalController: ModalController,
    private servicioFtp: FtpfilesService,
    private servicioPdf: ServPdfService,
    private router: Router,

  ) {
    
    if (this.loadingData) {
      dataService.mostrarLoading$.emit(true)
    }

   }



  ngOnInit() {

  }

  ionViewWillEnter() {
    this.dataService.setSubmenu('Psicologia');
    if (this.listaTareas.length == 0) {
      this.listarAspirantes({ detail: { value: this.estado } });
      this.contPagina = 0;
    }

  }

  
  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }

  listarAspirantes(event?) {

    this.loadingData = true;
    this.listaTareas = [];
    this.aspirantesNuevo = [];
    this.contPagina = 0;
    let id;

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
    
    this.subscription = this.dataService.listadoPorDepartamento('psico', id).subscribe(res => {
      
      //console.log(id,"**",res)
      //if (res['aspirantes'].length) {
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

            this.dataService.getAspirante(aspirante['asp_cedula']).subscribe((data) => {
              //console.log(aspirante, data)
              this.dataService.aspirante = data['result'][0];
              this.router.navigate(['/inicio/tab-aspirante/aspirante-new/' + aspirante['asp_cedula']])

            })
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
            this.dataService.mostrarLoading( )
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

            this.dataService.getAspirante(aspirante['asp_cedula']).subscribe(res => {
              //console.log(res)
              this.dataService.aspirante = res['result'][0];
              //this.router.navigate(['/inicio/tab-aspirante/aspirante-new/' + aspirante['asp_cedula']])

            })
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
      componentProps: {
        aspirante: objAspirante,
        rol: 'psico',
        objModal: this.modalController
      }
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
        
        console.log(res)
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

        this.numNotificaciones--;

        this.listaTareas.forEach((element, index) => {
          if (element.asp_cedula == aspirante.apv_aspirante) {
            this.listaTareas.splice(index, 1);
            this.contPagina = 0;
            this.aspirantesNuevo = this.listaTareas.slice(0, 4);
            this.dataService.presentAlert("VALIDACION COMPLETA", "La información del aspirante has sido ingresada exitosamente.");
            return;
          }
        });

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
