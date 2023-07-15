import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { ServPdfService } from 'src/app/services/serv-pdf.service';

import { Swiper } from "swiper";

@Component({
  selector: 'app-form-validar-psico',
  templateUrl: './form-validar-psico.component.html',
  styleUrls: ['./form-validar-psico.component.scss'],
})
export class FormValidarPsicoComponent {

  placeholder = 'Angular';

  @Input("aspirante") aspirante: any;
  @Input("rol") rol: any;
  @Input("objmodal") modal: any;
  @ViewChild(IonContent) content: IonContent | undefined;

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  validado = false
  selectSlide = 0;
  validado1 = false

  asp_edad: any = ''
  loading: boolean = false;

  file_Ficha: any;
  file_Test: any;
  existeFicha: boolean = false;
  existeTest: boolean = false;

  showMedicina = false;
  listaObservaciones = [];

  generandoficha = false;

  //objPage: any = {};

  constructor(
    public alertController: AlertController,
    private servicioPdf: ServPdfService,

  ) { }

  ngOnInit() {
    //this.objPage = this;
    this.aspirante.apv_verificado = (this.aspirante.apv_verificado as boolean == true) ? true : false;
    if (this.aspirante.asp_estado == 4 || !this.aspirante.asp_estado)
      this.aspirante.asp_estado = 5;

  }


  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }


  ionViewDidEnter() {

    if (this.aspirante == true)
      this.validado = true

    this.getEdad()
  }

  getEdad() {
    //convert date again to type Date
    const bdate = new Date(this.aspirante.asp_fecha_nacimiento);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    this.asp_edad = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    //console.log(this.asp_edad)
  }

  editTextbox(evento: any, campo: string) {
    if (evento.detail.value)
      this.aspirante[campo] = evento.detail.value
  }

  setAprobado(evento: any) {
    // console.log(evento)
    if (!evento.detail.value) return

    //this.aspirante.apv_aprobado = evento.detail.value
    if (evento.detail.value == 'NO') {
      this.aspirante.asp_estado = 5
    } else {
      this.aspirante.asp_estado = 6
    }
    //this.aspirante.apv_aprobado = evento.detail.value

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
    //console.log(role + " Clic!!")
    //this.roleMessage = `Dismissed with role: ${role}`;
  }



  archivoListo(archivo: any, variable: string) {
    this["file_" + variable] = archivo;
    this["existe" + variable] = true;
    // console.log(variable);
  }

  finalizarCambios() {
    let validado = true
    //return;
    // '../psicologia/0705150803.xlsx'.replace('..','https://getssoma.com/servicios')
    const fecha: Date = new Date()
    const faprobado = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    this.aspirante.apv_verificado = "true"
    this.aspirante.apv_faprobado = faprobado
    this.aspirante.apv_aspirante = this.aspirante.asp_cedula

    let apv_observacion = [];
    this.listaObservaciones.forEach(element => {
      apv_observacion.push(element['text']);
    });

    //this.aspirante.apv_observacion = JSON.stringify(apv_observacion);
    // console.log(apv_observacion, ' **> ' ,this.aspirante.apv_observacion)

    //this.modal.

    this.modal.dismiss({
      aspirante: this.aspirante,
      ficha: (this.existeFicha) ? this.file_Ficha : null,
      test: (this.existeTest) ? this.file_Test : null,
      validado
    });

  }

  cerrarModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    //this.aspirante = ""
    this.modal.dismiss({
      role: "cancelar"
    });
  }

  mostrarMedicina() {
    this.showMedicina = (this.showMedicina) ? false : true;
  }

  validarSlide1() {
    this.validado1 = true;
    //console.log(this.validado1)
  }


  setSlide(index: number) {
    this.swiper?.slideTo(index, 1000)
    this.selectSlide = index;
    this.content?.scrollToTop();

  }


  async generarEntrevistaPsicologia() {
    this.generandoficha = true;
    await this.servicioPdf.getPdfFichapsicologia(this.aspirante)
    setTimeout(() => {
      this.generandoficha = false;
    }, 3000);
    return 0;
  }
}
