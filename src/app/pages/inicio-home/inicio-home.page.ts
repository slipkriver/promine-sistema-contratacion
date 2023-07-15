import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
// import { DataService } from '../../services/data.service';
// import { FtpfilesService } from '../../services/ftpfiles.service';

@Component({
  selector: 'app-inicio-home',
  templateUrl: './inicio-home.page.html',
  styleUrls: ['./inicio-home.page.scss'],
})
export class InicioHomePage {

  componentes;
  filename = "";

  // file = <File>{};
  loading: boolean = false;

  constructor(

    // private servicioFtp: FtpfilesService,
    public dataService: DataService

  ) { }


  ngOnInit(){
    // console.log("inicio-home >>> ionViewWillEnter ", this.componentes )

    this.getMenuPrincipal()
  }


  ionViewDidEnter() {
    //this.servicioFtp.setArchivo('https://promine-ec.000webhostapp.com/imagenes')
    
  }

  async getMenuPrincipal(){

    this.dataService.getMenuPrincipal().subscribe( (menu:any) =>{
      // console.log(menu);  
      this.componentes = menu
    })

  }

}
