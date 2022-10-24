import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';

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

  validado = false
  
  asp_edad:any = ''
  loading: boolean = false;

  file: File = null;
  filename: string = "";

  file_ficha: any = ''
  existeficha: boolean = false

  file_test: any = ''
  existetest: boolean = false


  constructor(
    public alertController: AlertController,
    private servicioFtp: FtpfilesService

  ) { }

  ngOnInit() {

    //console.log(this.aspirante)
    
  }

  ionViewDidEnter() {

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

  editTextbox(evento, campo) {
    if (evento.detail.value)
      this.aspirante[campo] = evento.detail.value
  }

  setAprobado(evento){
    // console.log(evento)
    if(!evento.detail.value) return

    //this.aspirante.apv_aprobado = evento.detail.value
    if(evento.detail.value == 'NO'){
      this.aspirante.asp_estado = "NO ADMITIDO"
    }else{
      this.aspirante.asp_estado = "REVISION"
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

  fileChange(index, event) {

    const fileList: FileList = event.target.files;
    //check whether file is selected or not
    //console.log(fileList)
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

        if ( index==1 ){
          formData.append('task', 'subirfichapsico');
          this.file_ficha = formData
          this.existeficha = true
        } else {
        formData.append('task', 'subirtestpsico');
          this.file_test = formData
          this.existetest = true
        }
        //console.log(formData)

      } else {
        //this.snackBar.open('File size exceeds 4 MB. Please choose less than 4 MB','',{duration: 2000});
      }

    }

  }


  finalizarCambios() {
    let validado = true
    //return;
    // '../psicologia/0705150803.xlsx'.replace('..','https://getssoma.com/servicios')
    const fecha: Date = new Date()
    const faprobado  = fecha.toISOString().substring(0,11).replace('T',' ')+fecha.toTimeString().substring(0,8)
    this.aspirante.apv_verificado = "true"
    this.aspirante.apv_faprobado = faprobado
    
    // console.log(this.aspirante)
    // return

    this.modal.dismiss({
      aspirante: this.aspirante,
      ficha : (this.existeficha==true)?this.file_ficha:null,
      test : (this.existetest==true)?this.file_test:null,
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

}
