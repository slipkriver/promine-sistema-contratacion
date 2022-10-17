import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-form-validar-segu',
  templateUrl: './form-validar-segu.component.html',
  styleUrls: ['./form-validar-segu.component.scss'],
})

export class FormValidarSeguComponent implements OnInit {

  @Input("aspirante") aspirante;
  @Input("rol") rol;
  @Input("objmodal") modal;

  validado = false
  
  asp_edad:any = ''
  loading: boolean = false;

  constructor(
    public modalController: ModalController,
    public alertController: AlertController
  ) { }

  ngOnInit() {

    if(this.aspirante==true)
      this.validado = true

    this.getEdad()

  }

  getEdad() {
    //convert date again to type Date
    const bdate = new Date(this.aspirante.asp_fecha_nacimiento);
    const timeDiff = Math.abs(Date.now() - bdate.getTime() );
    this.asp_edad = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    //console.log(this.asp_edad)
  }
 
  cambiarCheckbox(campo, event) {
    // console.log(event)
    if (event.detail.checked==true || event.detail.checked==false)
      this.aspirante[campo] = event.detail.checked
    //this.verificarCheckbox()

  }
  
  editObservacion(evento) {
    if (evento.detail.value)
      this.aspirante.asv_observacion = evento.detail.value
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
            this.guardarCambios()
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    //console.log(role + " Clic!!")
    //this.roleMessage = `Dismissed with role: ${role}`;
  }


  guardarCambios() {
    const validado = true
    this.aspirante.asv_verificado = true
    //console.log(this.aspirante)

    this.modalController.dismiss({
      aspirante: this.aspirante,
      validado
    });
  }


  cerrarModal() {
    this.aspirante = ""
    this.modalController.dismiss({
      role: "cancelar"
    });
  }


}
