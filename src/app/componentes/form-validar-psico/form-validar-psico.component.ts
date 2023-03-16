import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';
import { ServPdfService } from 'src/app/services/serv-pdf.service';

import { SwiperComponent } from "swiper/angular";

@Component({
  selector: 'app-form-validar-psico',
  templateUrl: './form-validar-psico.component.html',
  styleUrls: ['./form-validar-psico.component.scss'],
})
export class FormValidarPsicoComponent implements OnInit {

  placeholder = 'Angular';

  @Input("aspirante") aspirante;
  @Input("rol") rol;
  @Input("objmodal") modal;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;

  validado = false
  selectSlide = 0;
  validado1 = false

  asp_edad: any = ''
  loading: boolean = false;

  file: File = null;
  filename: string = "";

  file_Ficha: any = ''
  file_Test: any = ''


  showMedicina = false;
  listaObservaciones = [];

  existeFicha: boolean = false;
  existeTest: boolean = false;

  subiendoTest = false;
  subiendoFicha = false;

  generandoficha = false;


  constructor(
    public alertController: AlertController,
    private servicioPdf: ServPdfService,

  ) { }

  ngOnInit() {

    // const lista = (!!this.aspirante.apv_observacion) ? JSON.parse(this.aspirante.apv_observacion) : [];
    // lista.forEach(element => {
    //   this.listaObservaciones.push({ text: element, edit: false });
    // });
    // console.log(this.aspirante.apv_verificado);

    this.aspirante.apv_verificado = (this.aspirante.apv_verificado as boolean == true) ? true : false;
    if (this.aspirante.asp_estado == 4)
      this.aspirante.asp_estado = 5

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

  editTextbox(evento, campo) {
    if (evento.detail.value)
      this.aspirante[campo] = evento.detail.value
  }

  setAprobado(evento) {
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

  fileChange(event, index?) {

    let strFile = 'Ficha';
    let formData = new FormData();

    if (index == 0) {
      formData.append('task', 'subirfichapsico');
    } else {
      strFile = 'Test'
      formData.append('task', 'subirtestpsico');
    }

    // console.log("FILE change...", event.target.files.length);
    
    if (event.target.files.length == 0) {
      this['existe' + strFile] = false;
      return;
    }

    const fileList: FileList = event.target.files;
    //check whether file is selected or not
    if (fileList.length > 0) {

      const file = fileList[0];
      //get file information such as name, size and type
      //console.log(file.name.split('.')[1]);
      //max file size is 4 mb
      if ((file.size / 1048576) <= 4) {
        //let task =  'subirfichapsico'
        formData.append('file', file, file.name);
        formData.append('aspirante', this.aspirante.asp_cedula)
        formData.append('ext', file.name.split('.')[1]);

        this['file_' + strFile] = formData
        this['subiendo' + strFile] = true;
        // this['existe' + strFile] = true;


      } else {
        //this.snackBar.open('File size exceeds 4 MB. Please choose less than 4 MB','',{duration: 2000});
      }

      setTimeout(() => {
        this['existe' + strFile] = true;
        this['subiendo' + strFile] = false;
        // console.log(strFile, " >>> ", this['existe' + strFile], this['subiendo' + strFile], this['file_' + strFile]);
      }, 3000);
    }
    //check whether file is selected or not

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
      ficha: (this.existeFicha == true) ? this.file_Ficha : null,
      test: (this.existeTest == true) ? this.file_Test : null,
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

  setSlide(index) {
    this.swiper.swiperRef.slideTo(index, 500);
    this.selectSlide = index;
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
