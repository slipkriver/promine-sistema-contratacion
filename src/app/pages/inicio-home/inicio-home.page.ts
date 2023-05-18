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
export class InicioHomePage{

  componentes;
  filename: string = "";
  file: File = null;
  loading: boolean = false;

  constructor(

    private servicioFtp: FtpfilesService,
    private dataService: DataService

  ) { }


  ionViewDidEnter() {
    //this.servicioFtp.setArchivo('https://promine-ec.000webhostapp.com/imagenes')
    this.componentes = this.dataService.getMenuPrincipal();
    
  }


}
