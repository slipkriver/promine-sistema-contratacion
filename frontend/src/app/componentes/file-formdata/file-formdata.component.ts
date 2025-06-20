import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-formdata',
  templateUrl: './file-formdata.component.html',
  styleUrls: ['./file-formdata.component.scss'],
})
export class FileFormdataComponent {

  @Output() setArchivo = new EventEmitter();
  @Input("aspirante") asp_cedula:any;
  @Input("urlarchivo") urlarchivo:string | undefined;
  @Input("verificado") verificado: boolean | undefined;
  @Input("tarea") serv_tarea:any;
  @Input("titulo") titulo:string | undefined;

  subiendoArchivo = false;
  existeArchivo: boolean = false;
  nombreArchivo = '';
  dragArchivo: boolean = false;

  constructor() { }

  ngOnInit() {
    // console.log(this.verificado, this.urlarchivo, this.titulo);

  }



  fileChange(event:any, drag = false) {

    event.preventDefault()
    //console.log("FILE change...", event.dataTransfer?.files[0]);

    if (!drag && event.target.files.length == 0) {
      //event.dataTransfer.files[0];
      return;
    }


    let formData = new FormData();



    const fileList: FileList = (drag == true) ? event.dataTransfer.files : event.target.files;
    //console.log(drag,"FILE change...", drag, fileList);
    //check whether file is selected or not
    if (fileList.length > 0) {
      // console.log("#2 FILE change...", fileList[0]);

      this.dragArchivo = false;
      this.subiendoArchivo = true;

      const file = fileList[0];
      //get file information such as name, size and type
      //console.log(file.name.split('.')[1]);
      //max file size is 4 mb
      if ((file.size / 1048576) <= 4) {
        //let task =  'subirfichapsico'
        formData.append('file', file, file.name);
        formData.append('aspirante', this.asp_cedula)
        formData.append('ext', file.name.split('.')[1]);
        formData.append('task', this.serv_tarea);
        this.nombreArchivo = file.name;

        // this['existe' + strFile] = true;


      } else {
        //this.snackBar.open('File size exceeds 4 MB. Please choose less than 4 MB','',{duration: 2000});
      }

      setTimeout(() => {
        // console.log(formData);
        this.setArchivo.emit(formData);
        this.existeArchivo = true;
        this.subiendoArchivo = false;
        //console.log(this.file_Registro.get('file').name);

        /* this.servicioFtp.uploadFile(formData).subscribe(res => {
          console.log(res);
        }); */

      }, 3000);
    }

  }


  onDragOverContent(event:any) {
    // console.log('**Content Over');
    this.dragArchivo = false;
    event.preventDefault();
  }

  onDragOver(event:any) {
    // console.log('...File OUT');
    this.dragArchivo = true;
    event.preventDefault();
  }

  onDragEnter(event:any) {
    // console.log('File over...');
    // this.dragArchivo = true;
    event.preventDefault();
  }


  onDragLeave(event:any) {

    event.preventDefault();
  }

  onDrop(event:any) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    // console.log(file);
    // Aquí puedes hacer lo que necesites con el archivo seleccionado mediante arrastrar y soltar
  }

  descargarArchivo() {
    window.open(this.urlarchivo?.replace('..', 'https://promine-ec.com'));
    return;
  }


}
