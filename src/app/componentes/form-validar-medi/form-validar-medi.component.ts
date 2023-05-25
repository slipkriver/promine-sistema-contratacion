import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, IonContent } from '@ionic/angular';
// import { Swiper } from "swiper";
import { ServPdfService } from 'src/app/services/serv-pdf.service';
import Swiper from 'swiper';

// import { register } from 'swiper/element/bundle';
// register Swiper custom elements
// register();

@Component({
  selector: 'app-form-validar-medi',
  templateUrl: './form-validar-medi.component.html',
  styleUrls: ['./form-validar-medi.component.scss'],
})

export class FormValidarMediComponent {

  @Input("aspirante") aspirante;
  @Input("rol") rol;
  @Input("objmodal") modal;

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  selectSlide = 0;
  validado1 = false
  validado2 = false
  valoracion = []
  evaluacion = []
  condicion = []

  fechaEmision: Date = new Date();

  file_Historia: any;
  file_Ficha: any;
  existeFicha: boolean = false;
  existeHistoria: boolean = false;

  mdFechaEmision = false


  generandohistoria = false;
  generandoficha = false;

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private servicioPdf: ServPdfService,
  ) { }

  ngOnInit() {

    if (this.rol == 'medi') {
      //this.valoracion = 
      this.getAspiranteLData('valoracion')
      this.getAspiranteLData('evaluacion')
      this.getAspiranteLData('condicion')
      //this.getAspiranteLData('valoracion')
    }

    // this.fechaEmision.setHours(this.fechaEmision.getHours()+5)
    this.aspirante.amv_femision = this.aspirante.amv_femision || this.fechaEmision.toLocaleString();
    this.aspirante.amv_evaluacion = this.aspirante.amv_evaluacion || "INGRESO";

    setTimeout(() => {
      if (!!this.aspirante.amv_valoracion) this.validarSlide1();
      if (!!this.aspirante.amv_condicion) this.validarSlide2();
    }, 1000);
    // this.fechaEmision.setHours(this.fechaEmision.getHours()-5)
  }


  swiperReady(){
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  getAspiranteLData(lista: string) {
    this.http.get("/assets/data/aspirantes/" + lista + ".json").subscribe(res => {
      this[lista] = <any>res
    })
  }

  editTextbox(evento, campo) {
    if (evento.detail.value)
      this.aspirante[campo] = evento.detail.value
  }


  setFecha(evento) {
    // console.log(this.fechaEmision.toUTCString(), this.fechaEmision.toLocaleDateString())

    let x = new Date(evento.detail.value)
    x.setHours(x.getHours() + 5)
    // console.log(evento.detail.value,x, this.fechaEmision.toJSON(), this.fechaEmision.toLocaleDateString(), this.fechaEmision.toISOString());

    const fecha = evento.detail.value.toString()
    var fechaTest = new Date(fecha);
    this.fechaEmision = fechaTest
    this.aspirante.amv_femision = fechaTest.toLocaleString()
    this.mdFechaEmision = false;
    //this.fechaEntrevista = new Date(evento.detail.value.toLocaleString());

  }


  abrirModalfecha(variable) {
    this.fechaEmision.setHours(this.fechaEmision.getHours() - 5)
    // console.log(variable,this[variable] ,this.fechaEmision.toISOString())
    if (this[variable] == true) {

      this[variable] = false
    } else {
      this[variable] = true
    }
  }


  async presentAlert() {

    if (this.selectSlide < 2) {
      this.setSlide(this.selectSlide + 1)
      return;
    };

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
            // setTimeout(() => {
            //console.log('Alert GUARDAR');
            this.finalizarCambios('')
            // }, 1000);
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    //console.log(role + " Clic!!")
    if (role == "confirm") {
      //this.finalizarCambios()
    }
    //this.roleMessage = `Dismissed with role: ${role}`;
  }



  archivoListo(archivo, variable) {
    this["file_" + variable] = archivo;
    this["existe" + variable] = true;
    // console.log(variable);
  }

  finalizarCambios(event) {
    var validado = true
    // '../psicologia/0705150803.xlsx'.replace('..','https://getssoma.com/servicios')
    const fecha: Date = new Date()
    const femision = this.fechaEmision.toISOString().substring(0, 19).replace('T', ' ')
    //this.aspirante.amv_femision = this.fechaEmision.toISOString().substring(0, 19).replace('T', ' ')
    this.aspirante.amv_aspirante = this.aspirante.asp_cedula;
    this.aspirante.amv_verificado = "true"
    this.aspirante.amv_femision = femision;
    this.aspirante.amv_urlficha = '';
    this.aspirante.amv_urlhistoria = '';
    this.aspirante.asp_estado = (this.aspirante.amv_valoracion == 'NO APTO') ? 3 : 4;

    // return

    this.modal.dismiss({
      aspirante: this.aspirante,
      historia: (this.existeHistoria) ? this.file_Historia : null,
      ficha: (this.existeFicha) ? this.file_Ficha : null,
      validado
    });

  }

  async generarHistoriaClinica() {
    this.generandoficha = true;
    await this.servicioPdf.getPdfFichamedica(this.aspirante);
    setTimeout(() => {
      this.generandoficha = false;
    }, 3000);
  }


  cerrarModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    //this.aspirante = ""
    this.modal.dismiss({
      role: "cancelar"
    });
  }

  validarSlide1() {
    this.validado1 = true;
    //console.log(this.validado1)
  }

  validarSlide2() {
    this.validado2 = true;
  }

  setSlide(index) {
    // console.log(this.swiper, " ########## ############ #### ");
    this.swiper?.slideTo(index,1000)
    this.selectSlide = index;

  }


}
