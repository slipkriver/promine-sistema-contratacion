import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, IonContent } from '@ionic/angular';

import { SwiperComponent } from "swiper/angular";
import jsonData from '../../../assets/data/empleados/list_epp.json';
//import from '../assets/data/empleados/list_epp.json';

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
  @ViewChild(IonContent) content: IonContent;

  lista_epp = [];
  aspirante_epp = [];
  listaObservaciones = [];
  validado = false

  selectSlide = 0;
  validado1 = false

  asp_edad: any = ''
  loading: boolean = false;

  file_Induccion: any = '';
  file_Procedimiento: any = '';
  file_Certificacion: any = '';
  file_Entrenamiento: any = '';
  file_Matrizriesgos: any = '';
  file_Evaluacion: any = '';

  existeInduccion: boolean = false;
  existeProcedimiento: boolean = false;
  existeCertificacion: boolean = false;
  existeEntrenamiento: boolean = false;
  existeMatrizriesgos: boolean = false;
  existeEvaluacion: boolean = false;

  generandoInduccion: boolean = false;
  generandoProcedimiento: boolean = false;
  generandoCertificacion: boolean = false;
  generandoEntrenamiento: boolean = false;
  generandoMatrizriesgos: boolean = false;
  generandoEvaluacion: boolean = false;

  isbuscando: boolean = false;
  txtbusqueda = '';

  constructor(
    public modalController: ModalController,
    public alertController: AlertController
  ) { }

  ngOnInit() {

    this.aspirante.asv_verificado = (this.aspirante.asv_verificado as boolean == true) ? true : false;
    if (this.aspirante.asp_estado == 4 || !this.aspirante.asp_estado)
      this.aspirante.asp_estado = 5;

  }

  ionViewDidEnter() {

    if (this.aspirante == true)
      this.validado = true

    this.getEdad()
    // console.log( this.lista_epp );

  }

  getEdad() {
    //convert date again to type Date
    const bdate = new Date(this.aspirante.asp_fecha_nacimiento);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    this.asp_edad = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    //console.log(this.asp_edad)
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



  archivoListo(archivo, variable) {
    this["file_" + variable] = archivo;
    this["existe" + variable] = true;
    // console.log(variable);
  }

  finalizarCambios() {
    var validado = true

    const fecha: Date = new Date()
    const fverificado = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    this.aspirante.asv_fverificado = fverificado;
    this.aspirante.asv_aspirante = this.aspirante.asp_cedula;
    //this.aspirante.asv_lugar = this.aspirante.asp_cargo;
    this.aspirante.asp_estado = 10;
    //console.log(this.aspirante)
    //return

    // let atv_observacion = [];
    // this.listaObservaciones.forEach(element => {
    //   atv_observacion.push(element['text']);
    // });
    // console.log(this.aspirante)
    // return
    //this.aspirante.asv_observacion = JSON.stringify(asv_observacion);
    this.aspirante.asv_equipo = JSON.stringify(this.aspirante_epp);
    
    this.modalController.dismiss({
      aspirante: this.aspirante,
      Induccion: (this.existeInduccion) ? this.file_Induccion : '',
      Procedimiento: (this.existeProcedimiento) ? this.file_Procedimiento : '',
      Certificacion: (this.existeCertificacion) ? this.file_Certificacion : '',
      Entrenamiento: (this.existeEntrenamiento) ? this.file_Entrenamiento : '',
      Matrizriesgos: (this.existeMatrizriesgos) ? this.file_Matrizriesgos : '',
      Evaluacion: (this.existeEvaluacion) ? this.file_Evaluacion : '',
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
    this.swiper.swiperRef.slideTo(index, 1000);
    this.selectSlide = index;
    this.content.scrollToTop();
  }


  handleChange(event) {
    const query = event.target.value.toLowerCase();
    // console.log(" ## Change event()", query);
    if (query.length == 0) {
      this.lista_epp = [];
      this.isbuscando = false;
      return;
    }

    this.lista_epp = jsonData.filter(d => d.item.toLowerCase().indexOf(query) > -1 || d.codigo.indexOf(query) > -1).slice(0, 4);
    this.isbuscando = false;
  }

  handleClear() {
    setTimeout(() => {
      this.lista_epp = [];
      this.isbuscando = false;
    }, 500);
  }

  handleBlur() {
    if (!this.isbuscando)
      this.isbuscando = true
    //console.log(" ** Input focus()");

  }

  addArticulo(event) {
    let asp_epp = {
      codigo: event.codigo,
      item: event.item,
      cantidad: 1
    }

    this.aspirante_epp.push(asp_epp)
    // this.lista_epp = [];
  }

  getNombreStyle(cadena) {
    const srtbus = this.txtbusqueda.trim().toUpperCase();
    // console.log(srtbus);
    return cadena.replace(srtbus, '<b>' + srtbus + '</b>') as HTMLElement;
  }



}
