import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';

import { SwiperComponent } from "swiper/angular";

@Component({
  selector: 'app-form-validar-segu',
  templateUrl: './form-validar-segu.component.html',
  styleUrls: ['./form-validar-segu.component.scss'],
})

export class FormValidarSeguComponent implements OnInit {

  @Input("aspirante") aspirante;
  @Input("rol") rol;
  @Input("objmodal") modal;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  
  listaObservaciones = [];
  validado = false

  selectSlide = 0;
  validado1 = false
  
  asp_edad:any = ''
  loading: boolean = false;

  constructor(
    public modalController: ModalController,
    public alertController: AlertController
  ) { }

  ngOnInit() {

    // if(this.aspirante==true)
    //   this.validado = true
    // this.getEdad()

  }

  // getEdad() {
  //   const bdate = new Date(this.aspirante.asp_fecha_nacimiento);
  //   const timeDiff = Math.abs(Date.now() - bdate.getTime() );
  //   this.asp_edad = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
  //   console.log(this.asp_edad)
  // }
 
  cambiarCheckbox(campo, event) {
    // console.log(event)
    if (event.detail.checked == true || event.detail.checked == false)
      this.aspirante[campo] = event.detail.checked
    //this.verificarCheckbox()

  }

  setAprobado(evento) {
    //console.log(evento)
    if (!evento.detail.value) return

    this.aspirante.atv_aprobado = evento.detail.value
    if (evento.detail.value == 'SI') {
      this.aspirante.asp_estado = "VERIFICADO"
    } else {
      this.aspirante.asp_estado = "NO APROBADO"
    }
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
    const fverificado = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    this.aspirante.atv_fverificado = fverificado
    //console.log(this.aspirante)
    //return

    let atv_observacion = [];
    this.listaObservaciones.forEach(element => {
      atv_observacion.push(element['text']);
    });
    //console.log(atv_observacion)
    this.aspirante.atv_observacion = JSON.stringify(atv_observacion);
    this.modalController.dismiss({
      aspirante: this.aspirante,
      validado
    });
  }

  // editObservacion(evento) {
  //   if (evento.detail.value)
  //     this.aspirante.asv_observacion = evento.detail.value
  // }

 
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
    //console.log(role + " Clic!!")
    //this.roleMessage = `Dismissed with role: ${role}`;
  }

  validarSlide1() {
    this.validado1 = true;
    //console.log(this.validado1)
  }

  setSlide(index) {
    this.swiper.swiperRef.slideTo(index, 500);
    this.selectSlide = index;
  }

  // guardarCambios() {
  //   const validado = true
  //   this.aspirante.asv_verificado = true

  //   this.modalController.dismiss({
  //     aspirante: this.aspirante,
  //     validado
  //   });
  // }
}
