import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-form-validar-tthh',
  templateUrl: './form-validar-tthh.component.html',
  styleUrls: ['./form-validar-tthh.component.scss'],
})
export class FormValidarTthhComponent implements OnInit {

  @Input("aspirante") aspirante;
  validado = false

  constructor(
    public modalController: ModalController,
    public alertController: AlertController
  ) { }

  ngOnInit() {

    // setTimeout(() => {
    //   console.log(this.aspirante)
    // }, 1000);
    //console.log(this.aspirante)


  }

  ionViewDidEnter() {
    //this.verificarCheckbox()
    //this.aspirante['atv_aprobado'] = <string>this.aspirante['atv_aprobado']
    this.validado = this.aspirante.atv_verificado

  }

  cambiarCheckbox(campo, event) {
    // console.log(event)
    if (event.detail.checked==true || event.detail.checked==false)
      this.aspirante[campo] = event.detail.checked
    //this.verificarCheckbox()

  }

  verificarCheckbox() {
    if (this.aspirante.atv_plegales == true && this.aspirante.atv_pfiscalia == true
      && this.aspirante.atv_ppenales == true && this.aspirante.atv_plaborales == true) {
      //this.validado = this.aspirante.atv_verificado = true
    } else {
      //this.validado = this.aspirante.atv_verificado = false
    }
  }

  cambiarToggle(evento) {
    this.aspirante.atv_verificado = evento.detail.checked
    this.aspirante.atv_observacion = ""

  }

  editObservacion(evento) {
    if (evento.detail.value)
      this.aspirante.atv_observacion = evento.detail.value
  }

  cerrarModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.aspirante = ""
    this.modalController.dismiss({
      role: "cancelar"
    });
  }

  setAprobado(evento){
    //console.log(evento)
    if(!evento.detail.value) return

    this.aspirante.atv_aprobado = evento.detail.value
    if(evento.detail.value == 'SI'){
      this.aspirante.asp_estado = "VERIFICADO"
    }else{
      this.aspirante.asp_estado = "NO APROBADO"
    }
  }


  guardarCambios() {
    var validado = false
    //console.log(this.aspirante)

    if (this.aspirante.atv_plegales && this.aspirante.atv_pfiscalia && this.aspirante.atv_ppenales && this.aspirante.atv_plaborales) {
      //validado = true
    }
    this.modalController.dismiss({
      aspirante: this.aspirante,
      validado
    });
  }

  
  finalizarCambios() {
    var validado = true

    const fecha: Date = new Date()
    const fverificado  = fecha.toISOString().substring(0,11).replace('T',' ')+fecha.toTimeString().substring(0,8)
    this.aspirante.atv_fverificado = fverificado
    //console.log(this.aspirante)
    //return

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

    const { role } = await alert.onDidDismiss();
    console.log(role + " Clic!!")
    //this.roleMessage = `Dismissed with role: ${role}`;
  }

  
}
