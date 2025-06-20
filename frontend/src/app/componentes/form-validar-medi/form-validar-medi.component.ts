import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController, ModalController } from '@ionic/angular';
// import { Swiper } from "swiper";
import { ServPdfService } from 'src/app/services/serv-pdf.service';
import { Swiper } from 'swiper';

// import { register } from 'swiper/element/bundle';
// register Swiper custom elements
// register();

@Component({
  selector: 'app-form-validar-medi',
  templateUrl: './form-validar-medi.component.html',
  styleUrls: ['./form-validar-medi.component.scss'],
})

export class FormValidarMediComponent {

  @Input("aspirante") aspirante: any;
  @Input("rol") rol: any;
  //@Input("objmodal") modal: any;
  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;


  selectSlide = 0;
  validado1 = false
  validado2 = false
  valoracion: any[] = []
  evaluacion: any[] = []
  condicion: any[] = []

  fechaEmision: Date = new Date();
  fechaString;

  file_Historia: any;
  file_Ficha: any;
  existeFicha: boolean = false;
  existeHistoria: boolean = false;

  mdFechaEmision = false


  generandohistoria = false;
  generandoficha = false;

  // objPage: any = {};

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    private http: HttpClient,
    private servicioPdf: ServPdfService
  ) {
    //this.setFecha()
   }

  ngOnInit() {

    if (this.rol == 'medi') {
      //this.valoracion = 
      this.getAspiranteLData('valoracion')
      this.getAspiranteLData('evaluacion')
      this.getAspiranteLData('condicion')
      //this.getAspiranteLData('valoracion')
    }

    // this.fechaEmision.setHours(this.fechaEmision.getHours()+5)
    if(this.aspirante.amv_femision){
      this.fechaEmision = new Date(this.aspirante.amv_femision)
      this.setFecha( {detail:{value:this.fechaEmision.toISOString()}} )
      this.fechaString=this.fechaEmision.toISOString()
    }else{
      this.aspirante.amv_femision = this.fechaEmision.toLocaleString();
      this.setFecha( {detail:{value:this.fechaEmision.toISOString()}} )
    }
    
    //this.aspirante.amv_femision = this.fechaEmision.toLocaleString();
    this.aspirante.amv_evaluacion = this.aspirante.amv_evaluacion || "INGRESO";
    
    //console.log(this.aspirante.amv_femision,"*****",this.fechaString);
    // console.log(this.aspirante.amv_femision,"\n",this.fechaEmision.toISOString());
    
    setTimeout(() => {
      if (!!this.aspirante.amv_valoracion) this.validarSlide1();
      if (!!this.aspirante.amv_condicion) this.validarSlide2();
    }, 1000);
    // this.fechaEmision.setHours(this.fechaEmision.getHours()-5)
  }


  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }

  getAspiranteLData(lista) {
    this.http.get("/assets/data/aspirantes/" + lista + ".json").subscribe(res => {
      this[lista] = <any>res
    })
  }

  editTextbox(evento, campo) {
    if (evento.detail.value)
      this.aspirante[campo] = evento.detail.value
  }


  setFecha(evento, fromElement = false) {
    
    // let x = new Date(evento.detail.value)
    // x.setHours(x.getHours() - 5)
    
    const fecha = new Date(evento.detail.value.toString())
    // const hora = fecha.setHours(fecha.getHours()-5);
    let fechaTest = fecha
    fechaTest.setHours(fecha.getHours()-5);

    this.fechaEmision = fechaTest;
    //fechaTest.setHours(hora)
    // console.log(fechaTest.toISOString(),"++++++++",fecha, "+++++++++", this.fechaEmision, "$$$$$", fecha.getUTCHours())
    // this.aspirante.amv_femision = fecha.toLocaleString()
    this.aspirante.amv_femision = this.fechaEmision.toISOString().substring(0, 19).replace('T', ' ')
    // console.log(fechaTest.toLocaleString(), fecha.toISOString(), this.aspirante.amv_femision);
    //this.fechaString = this.fechaEmision.toISOString()
    //return;
    //this.fechaEntrevista = new Date(evento.detail.value.toLocaleString());
    this.mdFechaEmision = false;

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



  archivoListo(archivo: any, variable: string) {
    this["file_" + variable] = archivo;
    this["existe" + variable] = true;
    // console.log(variable);
  }

  finalizarCambios(event: any) {
    var validado = true
    // '../psicologia/0705150803.xlsx'.replace('..','https://getssoma.com/servicios')
    // const fecha: Date = new Date()
    // const femision = this.fechaEmision.toISOString().substring(0, 19).replace('T', ' ')
    //this.aspirante.amv_femision = this.fechaEmision.toISOString().substring(0, 19).replace('T', ' ')
    this.aspirante.amv_aspirante = this.aspirante.asp_cedula;
    this.aspirante.amv_verificado = "true"
    // this.aspirante.amv_femision = femision;
    this.aspirante.amv_urlficha = '';
    this.aspirante.amv_urlhistoria = '';
    this.aspirante.asp_estado = (this.aspirante.amv_valoracion == 'NO APTO') ? 3 : 4;

    // console.log(this.aspirante.amv_femision, femision, this.fechaEmision);
    // return

    this.modalController.dismiss({
      aspirante: this.aspirante,
      historia: (this.existeHistoria) ? this.file_Historia : null,
      ficha: (this.existeFicha) ? this.file_Ficha : null,
      validado
    });

  }

  async generarHistoriaClinica() {
    this.generandoficha = true;
    // console.log(this.fechaEmision, this.aspirante.amv_femision);
    //this.aspirante.amv_femision = this.fechaEmision;
    await this.servicioPdf.getPdfFichamedica(this.aspirante);
    setTimeout(() => {
      this.generandoficha = false;
    }, 3000);
  }


  cerrarModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    //this.aspirante = ""
    this.modalController.dismiss({
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

  setSlide(index: number) {
    // console.log(this.swiper, " ########## ############ #### ");
    this.swiper?.slideTo(index, 1000)
    this.selectSlide = index;

  }

  cambiarCheckbox(campo:string, event:any) {
    // console.log(event)
    if (event.detail.checked == true || event.detail.checked == false)
      this.aspirante[campo] = event.detail.checked
    //this.verificarCheckbox()

  }

  seSelectItem(evento, campo) {
    if (!evento.detail.value) return
    
    this.aspirante[campo] = evento.detail.value
    console.log(evento, this.aspirante[campo], campo)
    if (evento.detail.value == 'SI') {
      this.aspirante.asp_estado = 2
    } else {
      this.aspirante.asp_estado = 1
    }
  }

}
