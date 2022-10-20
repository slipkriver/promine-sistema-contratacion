import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { FormValidarSeguComponent } from '../../componentes/form-validar-segu/form-validar-segu.component';


@Component({
  selector: 'app-principal-seguridad',
  templateUrl: './principal-seguridad.page.html',
  styleUrls: ['./principal-seguridad.page.scss'],
})
export class PrincipalSeguridadPage implements OnInit {

  aspirantesBuscar = []

  estados = []
  estado

  listaTareas = []
  numNotificaciones = 0;

  aspirantesNuevo = []
  contPagina = 0;

  constructor(
    private actionSheetCtr: ActionSheetController,
    private modalController: ModalController,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.dataService.aspOpciones$.subscribe(item => {
      if (item.departamento == 'seguridad')
        this.opcionesTarea(item);
    })

  }


  ionViewDidEnter() {

    setTimeout(() => {
      this.dataService.setSubmenu('Seguridad Ocupacional');
    }, 500);

    if (this.dataService.isloading) {
      this.dataService.cerrarLoading()
    }

    this.listarAspirantes({ detail: { value: 0 } })
  }

  ionViewDidLeave(){
    console.log('CHAUUU')
  }


  listarAspirantes(event?) {

    this.dataService.mostrarLoading()

    this.listaTareas = [];
    this.contPagina = 0;

    const id = (event) ? event.detail.value : 0
    this.estado = id

    // this.estado = this.estados[id]
    //console.log(event, id, parseInt(id))
    
    this.dataService.listadoPorDepartamento('segu', id).subscribe(res => {
      //console.log(res, id)
      res['aspirantes'].forEach(element => {
        if (element.asp_estado == 'NO ADMITIDO') {
          element.asp_colorestado = "danger"
        } else if (element.asp_estado == 'EXAMENES') {
          element.asp_colorestado = "success"
        } else {
          element.asp_colorestado = "primary"
        }
      });
      this.listaTareas = res['aspirantes']
      this.aspirantesNuevo = this.listaTareas.slice(0,4);

      if (id == 0) {
        this.numNotificaciones = this.listaTareas.length
      }

      this.dataService.cerrarLoading()
    })

  }


  updatePagina(value){
    this.contPagina = this.contPagina + value;
    //console.log(this.contPagina*4,(this.contPagina+1)*4)
    this.aspirantesNuevo = this.listaTareas.slice(this.contPagina*4,(this.contPagina+1)*4);
  }


  async opcionesTarea(aspirante) {

    this.dataService.getAspiranteRole(aspirante['asp_cedula'], 'segu').subscribe(res => {

      this.dataService.aspirante = res['aspirante']
      //console.log(res)
      aspirante = res['aspirante']

    })

    //var strTitulo = aspirante.asp_cedula + '::' 
    var strTitulo = aspirante.asp_nombre
    const opciones = await this.actionSheetCtr.create({
      header: strTitulo,
      cssClass: 'action-sheet-th',
      buttons: [
        {
          text: 'Ficha de induccion',
          icon: 'checkmark-circle',
          handler: async () => {
            setTimeout(() => {

              this.abrirFormsegu(aspirante)

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


  async abrirFormsegu(aspirante) {

    const objAspirante = JSON.parse(JSON.stringify(aspirante))

    const modal = await this.modalController.create({
      component: FormValidarSeguComponent,
      cssClass: 'my-modal-class',
      componentProps: {
        aspirante: objAspirante,
        rol: 'segu',
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

    this.dataService.mostrarLoading();

    this.dataService.verifySeguridad(data.aspirante).subscribe(res => {

      //console.log(res)
      if (res['success']) {

        this.listaTareas.forEach((element, index) => {
          if (element.asp_cedula == aspirante.asv_aspirante) {
            this.listaTareas.splice(index, 1);
            this.contPagina = 0;
            this.aspirantesNuevo = this.listaTareas.slice(0,4);
          }
        });

        this.dataService.presentAlert("VALIDACION COMPLETA", "La información del aspirante has sido ingresada exitosamente.")
        
        this.numNotificaciones--;

      }

      this.dataService.cerrarLoading();

    });

    
  }

  setEstado(evento) {
    // console.log(evento)
    //this.estado = evento.detail.value
    this.listarAspirantes(evento)
  }


}
