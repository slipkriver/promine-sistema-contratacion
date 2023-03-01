import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ModalController, AlertController, PopoverController } from '@ionic/angular';
import { ServPdfService } from 'src/app/services/serv-pdf.service';

import { SwiperComponent } from "swiper/angular";

import { PopoverInfoComponent } from '../popover-info/popover-info.component';

@Component({
  selector: 'app-form-validar-tthh',
  templateUrl: './form-validar-tthh.component.html',
  styleUrls: ['./form-validar-tthh.component.scss'],
})
export class FormValidarTthhComponent implements OnInit {

  @Input("aspirante") aspirante;
  @ViewChild('swiper', { static: false }) swiper?: SwiperComponent;
  validado = false

  listaObservaciones = [];

  generandoficha = false;
  generandoregistro = false;
  generandoreglamento = false;

  file_Registro: any = ''
  existeRegistro: boolean = false;
  subiendoRegistro = false;
  file_Reglamento: any = ''
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
    let cont = 0;

    //console.log(lista,cont, this.aspirante.atv_observacion)

    lista.forEach(element => {
      this.listaObservaciones.push({ text: element, edit: false });
      cont++;
    });

    // setTimeout(() => {
    // }, 1000);

  }

  ionViewDidEnter() {
    //this.verificarCheckbox()
    //this.aspirante['atv_aprobado'] = <string>this.aspirante['atv_aprobado']

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
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      role: "cancelar"
    }).then(() => this.aspirante = {});
  }

  setAprobado(evento) {
    //console.log(evento)
    if (!evento.detail.value) return

    this.aspirante.atv_aprobado = evento.detail.value
    if (evento.detail.value == 'SI') {
      this.aspirante.asp_estado = 3
    } else {
      this.aspirante.asp_estado = 2
    }
  }


  fileChange(event, index?) {

    let strFile = 'Registro';
    let formData = new FormData();

    if (index == 0) {
      formData.append('task', 'subirregistrotthh');
    } else {
      strFile = 'Reglamento'
      formData.append('task', 'subirreglamentotthh');
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

  }


  finalizarCambios() {
    var validado = true

    const fecha: Date = new Date()
    const fverificado = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    this.aspirante.atv_fverificado = fverificado
    this.aspirante.asp_estado = 1;
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
      registro: (this.existeRegistro == true) ? this.file_Registro : null,
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

}
