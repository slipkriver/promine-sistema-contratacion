import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-form-validar-social',
  templateUrl: './form-validar-social.component.html',
  styleUrls: ['./form-validar-social.component.scss'],
})
export class FormValidarSocialComponent implements OnInit {

  @Input("aspirante") aspirante;

  asp_edad: any = ''
  validado = false

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.validado = this.aspirante.atv_verificado;

    const lista = JSON.parse(this.aspirante.atv_observacion);

    //console.log(this.aspirante.atv_verificado)

   
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

  archivoListo(archivo, variable){
    this["file_"+variable] = archivo;
    this["existe"+variable] = true;
    // console.log(variable);
  }
}
