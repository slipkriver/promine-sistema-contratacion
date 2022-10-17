import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { FormValidarPsicoComponent } from '../../componentes/form-validar-psico/form-validar-psico.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal-psicologia',
  templateUrl: './principal-psicologia.page.html',
  styleUrls: ['./principal-psicologia.page.scss'],
})
export class PrincipalPsicologiaPage implements OnInit {

  estado = { est_id: 0 }
  listaTareas = []
  aspirantesBuscar = []

  numNotificaciones = 0;

  constructor(
    private actionSheetCtr: ActionSheetController,
    private dataService: DataService,
    public modalController: ModalController,
    private servicioFtp: FtpfilesService,
    private router: Router,

  ) { }

  ngOnInit() {


  }

  ionViewDidEnter() {

    setTimeout(() => {
      this.dataService.setSubmenu('Psicologia');
    }, 500);

    if (this.dataService.isloading) {
      this.dataService.cerrarLoading()
    }

    this.listarAspirantes({ detail: { value: 0 } })

    //this.validado = this.aspirante.atv_verificado
  }

  listarAspirantes(event?) {

    this.dataService.mostrarLoading()

    this.listaTareas = []
    const id = (event) ? event.detail.value : 0

    this.estado = id
    //console.log( id, parseInt(id))
    this.dataService.listadoPorDepartamento('psico', id).subscribe(res => {
      this.listaTareas = res['aspirantes']
      //console.log(res)
      if (id == 0) {
        this.numNotificaciones = this.listaTareas.length
      }

      this.dataService.cerrarLoading()
    })

  }


  async opcionesTarea(aspirante) {

    //this.dataService.mostrarLoading()

    const asp_estado = aspirante.asp_estado

    if (asp_estado == 'VERIFICADO' || asp_estado == 'PSICOSOMETRIA' || asp_estado == 'NO APTO') {
      this.dataService.getAspiranteRole(aspirante['asp_cedula'], 'psico').subscribe(res => {

        this.opcionesPsico1(aspirante)

      })

    /*} else if (asp_estado == 'APROBADO' || asp_estado == 'PSICOLOGIA') {
      this.dataService.getAspiranteRole(aspirante['asp_cedula'], 'psico').subscribe(res => {

        this.opcionesPsico2(aspirante)

      })*/

    } else {
      this.dataService.getAspiranteRole(aspirante['asp_cedula'], 'psico').subscribe(res => {

        this.opcionesPsico1(aspirante)

      })
    }

    this.dataService.getAspiranteRole(aspirante['asp_cedula'], 'psico').subscribe(res => {

      this.dataService.aspirante = res['aspirante']
      //console.log(res)
      aspirante = res['aspirante']
      //this.dataService.cerrarLoading()

    })

    //var strTitulo = aspirante.asp_cedula + '::' 

  }

  async opcionesPsico1(aspirante) {

    var strTitulo = aspirante.asp_nombre
    const opciones = await this.actionSheetCtr.create({
      header: strTitulo,
      cssClass: '',
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
      cssClass: '',
      buttons: [
        {
          text: 'Ingresar fichas psicosometricas',
          icon: 'checkmark-circle',
          handler: async () => {
            setTimeout(() => {

              //this.abrirFormpsico(aspirante)

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
      cssClass: 'my-custom-class',
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

    // if (data.length>0) {
    data.aspirante.task = "actualizar"

    this.dataService.verifyPsicologia(data.aspirante).subscribe(res => {

      if (res['success'] == true && data.ficha != null) {
        this.servicioFtp.uploadFile(data.ficha).subscribe(res2 => {
          res = res2
          this.numNotificaciones--;
          this.dataService.cerrarLoading()
        })

        this.listaTareas.forEach((element, index) => {
          if (element.asp_cedula == aspirante.apv_aspirante) {
            this.listaTareas.splice(index, 1)
            this.dataService.presentAlert("VALIDACION COMPLETA", "La información del aspirante has sido ingresada exitosamente.")
          }
        });
        
      } else {
        this.dataService.cerrarLoading()
      }

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
