import { Component, OnInit } from '@angular/core';
import { FtpfilesService } from '../../services/ftpfiles.service';
import { Observable } from 'rxjs';
import { Componente } from 'src/app/interfaces/user';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-inicio-home',
  templateUrl: './inicio-home.page.html',
  styleUrls: ['./inicio-home.page.scss'],
})
export class InicioHomePage implements OnInit {

  componentes: Observable<Componente[]>
  filename: string = "";
  file: File = null;
  loading: boolean = false;

  constructor(

    private servicioFtp: FtpfilesService,
    private dataService: DataService

  ) { }


  ngOnInit() {
    //this.servicioFtp.setArchivo('https://promine-ec.000webhostapp.com/imagenes')
    this.componentes = this.dataService.getMenuPrincipal();
  }


  onChange(event) {
    this.file = event.target.files[0];
  }


  onUpload() {
    this.loading = !this.loading;
    console.log(this.file);
    this.servicioFtp.setArchivo(this.file).subscribe(
      (event: any) => {
        if (typeof (event) === 'object') {

          // Short link via api response
          this.filename = event.link;

          this.loading = false; // Flag variable 
        }
      }
    );
  }


}
