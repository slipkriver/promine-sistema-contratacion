import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { SwiperComponent } from "swiper/angular";
// import SwiperCore, { Swiper, Virtual } from 'swiper';

// SwiperCore.use([Virtual]);

@Component({
  selector: 'app-form-validar-medi',
  templateUrl: './form-validar-medi.component.html',
  styleUrls: ['./form-validar-medi.component.scss'],
})

export class FormValidarMediComponent implements OnInit {

  @Input("aspirante") aspirante;
  @Input("rol") rol;
  @Input("objmodal") modal;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  selectSlide = 0;
  validado = false
  valoracion = []
  evaluacion = []
  condicion = []

  fechaEmision: Date = new Date();

  file_data: any = ''
  existeficha: boolean = false;

  mdFechaEmision = false
  subiendoArchivo = false;

  constructor(
    private http: HttpClient,
    private alertController: AlertController,

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

    // this.fechaEmision.setHours(this.fechaEmision.getHours()-5)
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
      this.setSlide(this.selectSlide+1) 
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


  fileChange(event, index?) {

    if (event.target.files) {
      this.subiendoArchivo = true;
      this.existeficha = false
    }
    const fileList: FileList = event.target.files;
    //check whether file is selected or not
    if (fileList.length > 0) {

      const file = fileList[0];
      //get file information such as name, size and type
      //console.log(file.name.split('.')[1]);
      //max file size is 4 mb
      if ((file.size / 1048576) <= 4) {
        let formData = new FormData();
        //let task =  'subirfichapsico'
        formData.append('file', file, file.name);
        formData.append('aspirante', this.aspirante.asp_cedula)
        formData.append('ext', file.name.split('.')[1]);
        formData.append('task', 'subirfichamedi');

        this.file_data = formData
        //console.log(formData)

      } else {
        //this.snackBar.open('File size exceeds 4 MB. Please choose less than 4 MB','',{duration: 2000});
      }

      setTimeout(() => {
        if (this.file_data) this.existeficha = true;
        this.subiendoArchivo = false;
      }, 3000);
    }

  }


  finalizarCambios(event) {
    var validado = true
    // '../psicologia/0705150803.xlsx'.replace('..','https://getssoma.com/servicios')
    const fecha: Date = new Date()
    const femision = this.fechaEmision.toISOString().substring(0, 19).replace('T', ' ')
    //this.aspirante.amv_femision = this.fechaEmision.toISOString().substring(0, 19).replace('T', ' ')

    this.aspirante.amv_verificado = "true"
    this.aspirante.amv_femision = femision
    this.aspirante.asp_estado = (this.aspirante.amv_valoracion == 'NO APTO') ? "NO APTO" : "EXAMENES"

    // return

    this.modal.dismiss({
      aspirante: this.aspirante,
      ficha: (this.existeficha == true) ? this.file_data : null,
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

  setSlide(index) {
    this.swiper.swiperRef.slideTo(index, 500);
    this.selectSlide = index;
  }

}
