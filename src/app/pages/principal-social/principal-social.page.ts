import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-principal-social',
  templateUrl: './principal-social.page.html',
  styleUrls: ['./principal-social.page.scss'],
})
export class PrincipalSocialPage implements OnInit {

  aspirantesBuscar = []

  estados = []
  estado

  listaTareas = []
  numNotificaciones = 0;


  constructor(
    private actionSheetCtr: ActionSheetController,
    private modalController: ModalController,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {
  }


  ionViewDidEnter() {

    setTimeout(() => {
      this.dataService.setSubmenu('Trabajado Social');
    }, 500);

    if (this.dataService.isloading) {
      this.dataService.cerrarLoading()
    }

    this.listarAspirantes({ detail: { value: 0 } })
  }


  listarAspirantes(event) {

    this.dataService.mostrarLoading()

    this.listaTareas = []
    const id = (event) ? event.detail.value : 0

    this.estado = this.estados[id]
    //console.log(event, id, parseInt(id))
    this.dataService.listadoPorDepartamento('soci', id).subscribe(res => {
      //console.log(res)
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

      if (id == 0) {
        this.numNotificaciones = this.listaTareas.length
      }

      this.dataService.cerrarLoading()
    })

  }


  async opcionesTarea(aspirante) {

    /*this.dataService.getAspiranteRole(aspirante['asp_cedula'], 'segu').subscribe(res => {

      this.dataService.aspirante = res['aspirante']
      //console.log(res)
      aspirante = res['aspirante']

    })*/

    //var strTitulo = aspirante.asp_cedula + '::' 
    var strTitulo = `${aspirante.asp_apellidop} ${aspirante.asp_apellidom} ${aspirante.asp_nombres}`
    const opciones = await this.actionSheetCtr.create({
      header: strTitulo,
      cssClass: '',
      buttons: [
        {
          text: 'Formulario de Trabajo social',
          icon: 'checkmark-circle',
          handler: async () => {
            this.dataService.aspirante = aspirante;
            setTimeout(() => {

              //console.log(aspirante)
              this.router.navigate(['/inicio/tab-aspirante/aspirante-social/' + aspirante['asp_cedula']])

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


  async abrirFormsegu(aspirante) {

    console.log(aspirante)
    
  }

  setEstado(evento) {
    // console.log(evento)
    //this.estado = evento.detail.value
    this.listarAspirantes(evento)
  }


}
