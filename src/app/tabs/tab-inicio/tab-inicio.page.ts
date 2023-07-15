import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab-inicio',
  templateUrl: './tab-inicio.page.html',
  styleUrls: ['./tab-inicio.page.scss'],
})
export class TabInicioPage {

  submenu: any[] = []
  descripcionConst = "Pagina principal"
  descripcion = ""

  constructor(
    private servicioData: DataService
  ) { }

  ngOnInit() {

    // console.log('tab-inicio >>> @INICIO')
    /*this.selectSubItem('inicio')

    this.servicioData.submenu$.subscribe( res => {
      //console.log(res);
      this.submenu = res;
    })*/

  }


  selectSubItem(item){
    //this.servicioData.getSubMenu(item)
    console.log("tab-inicio >>> selectSubItem ",item)
    this.submenu = this.servicioData.submenu;
  }
  

  selectOpcion(item){
    console.log("tab-inicio >>> selectOpcion ",item)
    this.submenu.forEach(element => {
      element.activo = false
    });

    this.descripcion = item.descripcion
    item.activo = true
  }
  

  ionViewWillEnter  (){
    this.descripcion = this.descripcionConst
    // console.log("tab-inicio >>> ionViewWillEnter ", this.descripcion )
  }


  ionViewWillLeave (){
    this.submenu = []
    // console.log("tab-inicio >>> ionViewWillLeave ", this.submenu)
  }


}
