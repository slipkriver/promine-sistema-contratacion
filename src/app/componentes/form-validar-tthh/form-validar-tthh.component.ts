import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ServPdfService } from 'src/app/services/serv-pdf.service';

import { Swiper } from "swiper";

@Component({
  selector: 'app-form-validar-tthh',
  templateUrl: './form-validar-tthh.component.html',
  styleUrls: ['./form-validar-tthh.component.scss'],
})
export class FormValidarTthhComponent implements OnInit {

  @Input("aspirante") aspirante;
  @ViewChild('swiper', { static: false }) swiper?: Swiper;
  validado = false

  listaObservaciones = [];

  generandoficha = false;
  generandoregistro = false;
  generandoreglamento = false;

  file_Registro: any;
  existeRegistro: boolean = false;
  subiendoRegistro = false;
  file_Reglamento: any;
  existeReglamento: boolean = false;
  subiendoReglamento = false;


  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    private servicioPdf: ServPdfService,
  ) { }

  ngOnInit() {

    this.validado = this.aspirante.atv_verificado;

    const lista = JSON.parse(this.aspirante.atv_observacion);

    //console.log(this.aspirante.atv_verificado, '\n######\n', this.aspirante)

    lista.forEach(element => {
      this.listaObservaciones.push({ text: element, edit: false });
    });


  }

  ionViewDidEnter() {
    // setTimeout(() => {
    //   this.servicioPdf.getPdfFichamedica(this.aspirante);
    // }, 3000);
  }

  cambiarCheckbox(campo, event) {
    // console.log(event)
    if (event.detail.checked == true || event.detail.checked == false)
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
    this.modalController.dismiss({
      role: "cancelar"
    }).then(() => this.aspirante = {});
  }

  setAprobado(evento) {
    //console.log(evento)
    if (!evento.detail.value) return

    this.aspirante.atv_aprobado = evento.detail.value
    if (evento.detail.value == 'SI') {
      this.aspirante.asp_estado = 2
    } else {
      this.aspirante.asp_estado = 1
    }
  }


  finalizarCambios() {
    const validado = true

    const fecha: Date = new Date()
    const fverificado = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    this.aspirante.atv_fverificado = fverificado;
    this.aspirante.asp_estado = 2;
    this.aspirante.atv_aprobado = 'SI';
    //console.log(this.file_Registro.get('file'))
    //return

    let atv_observacion = [];
    this.listaObservaciones.forEach(element => {
      atv_observacion.push(element['text']);
    });
    // console.log(this.file_Reglamento )
    this.aspirante.atv_observacion = JSON.stringify(atv_observacion);
    this.modalController.dismiss({
      aspirante: this.aspirante,
      // registro: (this.existeRegistro == true) ? this.file_Registro : null,
      reglamento: (this.existeReglamento == true) ? this.file_Reglamento : null,
      validado
    });
  }


  async presentAlert() {

    // console.log(this.aspirante.atv_aprobado);

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

  scrollContent() {
    console.log("Scroll...")
  }


  async generarFichaIngresoNuevo() {
    this.generandoficha = true;
    await this.servicioPdf.getPdfFichaingreso(this.aspirante)
    setTimeout(() => {
      this.generandoficha = false;
    }, 3000);
  }

  async generarRegistroInduccion() {
    // console.log(this.aspirante.atv_urlregistro)
    if (!!this.aspirante.atv_urlregistro) {
      window.open(this.aspirante.atv_urlregistro.replace('..','https://getssoma.com'));
      return;
    }
    this.generandoregistro = true;
    await this.servicioPdf.getPdfRegistroInduccion(this.aspirante)
    setTimeout(() => {
      this.generandoregistro = false;
    }, 3000);
  }

  async generarReglamentoInterno() {
    // console.log(this.aspirante.atv_urlreglamento)
    if (!!this.aspirante.atv_urlreglamento) {
      window.open(this.aspirante.atv_urlreglamento.replace('..','https://getssoma.com'));
      return;
    }
    this.generandoreglamento = true;
    await this.servicioPdf.getReglamentoInterno(this.aspirante)
    setTimeout(() => {
      this.generandoreglamento = false;
    }, 3000);
  }
  
  archivoListo(archivo, variable){
    this["file_"+variable] = archivo;
    this["existe"+variable] = true;
    // console.log(variable);
  }

}
