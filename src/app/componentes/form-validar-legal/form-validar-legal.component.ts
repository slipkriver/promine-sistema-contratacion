import { Component, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-form-validar-legal',
  templateUrl: './form-validar-legal.component.html',
  styleUrls: ['./form-validar-legal.component.scss'],
})
export class FormValidarLegalComponent {

  @Input("aspirante") aspirante;
  listaObservaciones = [];

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    if( this.aspirante.asp_estado == 6){
      this.aspirante.alv_verificado = false;
      this.aspirante.alv_vdocumentos = false;
      this.aspirante.alv_vincidentes = false;
      this.aspirante.alv_vllamados = false;
      this.aspirante.alv_vnormativas = false;
    }
    // console.log( this.aspirante );
    
  }

  cambiarCheckbox(campo, event) {
    // console.log(event)
    if (event.detail.checked == true || event.detail.checked == false)
      this.aspirante[campo] = event.detail.checked
    //this.verificarCheckbox()

  }


  cerrarModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      role: "cancelar"
    }).then(() => this.aspirante = {});
  }

  finalizarCambios() {
    var validado = true

    const fecha: Date = new Date()
    const fingreso = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    this.aspirante.alv_fingreso = fingreso;
    this.aspirante.alv_aprobado = true;
    this.aspirante.alv_aspirante = this.aspirante.asp_cedula;
    this.aspirante.alv_verificado = true;
    this.aspirante.asp_estado = 8;
    // console.log(this.aspirante)
    // return

    //console.log(atv_observacion)
    this.modalController.dismiss({
      aspirante: this.aspirante,
      validado
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: '¿Desea guardar los cambios realizados en la solicitud del aspirante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('#Cancelado');
          }
        },
        {
          text: 'CONFIRMAR',
          role: 'confirm',
          handler: () => {
            //console.log('Alert GUARDAR');
            this.finalizarCambios()
          }
        }
      ]
    });

    await alert.present();

    //const { role } = await alert.onDidDismiss();
    //console.log(role + " Clic!!")
    //this.roleMessage = `Dismissed with role: ${role}`;
  }
}
