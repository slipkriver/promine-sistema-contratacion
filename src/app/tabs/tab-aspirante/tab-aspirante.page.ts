import { Component, OnInit, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab-aspirante',
  templateUrl: './tab-aspirante.page.html',
  styleUrls: ['./tab-aspirante.page.scss'],
})
export class TabAspirantePage implements OnInit {

  @ViewChild(IonTabs) tabsList: IonTabs;

  submenu: any[];
  descripcionConst = "Seguimiento de aspirantes"
  descripcion = ""

  idsubmenu = 1;

  constructor(
    private servicioData: DataService
  ) { }

  ngOnInit() {

    //const role = this.servicioData.dataLocal.userConfig.user.role;

    //this.submenu = this.servicioData.submenu;

    this.servicioData.submenu$.subscribe((list: any[]) => {
      //this.submenu = list;
      this.submenu = list;
      //console.log(this.submenu);
      this.selectOpcion(this.submenu[this.idsubmenu], this.idsubmenu)
      setTimeout(async () => {
      }, 200);

    });

  }

  async getSubmenu() {

    this.servicioData.getSubMenu();
    // console.log(this.tabsList);

  }


  selectOpcion(item, index) {
    // console.log(item, index, this.submenu, this.idsubmenu)
    this.submenu.forEach(element => {
      element.activo = false
    });

    this.descripcion = item.descripcion;
    item.activo = true
    this.idsubmenu = index;
    this.tabsList.select(this.submenu[this.idsubmenu].ruta)

  }

  selectOpcion2(nombre) {
    //console.log(nombre, this.submenu);
    this.submenu.forEach(element => {
      element.activo = false

      if (element.nombre == nombre) {
        element.activo = true
        this.descripcion = element.descripcion
        //console.log(element)
      }
    });

  }

  ngAfterContentInit() {
    //this.submenu = this.servicioData.getSubMenu();
    //console.log(this.servicioData.submenu,"\n*********",this.submenu);

    //this.selectSubItem('aspirante');
    // console.log("1 **ngAfterContentInit");
    this.descripcion = this.descripcionConst;
  }

  ngAfterViewInit() {
    // console.log("2 **ngAfterViewInit")
  }

  ionViewWillEnter() {
    //console.log('3 **ionViewWillEnter', this.idsubmenu)
    //this.submenu = this.servicioData.submenu
    // this.getSubmenu();
    
  }
  
  ionViewDidEnter() {
    setTimeout(() => {
      this.getSubmenu();
    }, 500);
    //this.submenu = this.servicioData.submenu;
    //this.submenu = JSON.parse(JSON.stringify(this.servicioData.submenu));
    // console.log('4 **ionViewDidEnter')
    //this.tabsList.select(this.submenu[this.idsubmenu].ruta)

  }


  ionViewDidLeave() {
    //this.submenu = []
    // console.log('5 **ionViewWillLeave **EXIT')
  }




  OnDestroy() {
    this.servicioData.submenu$.complete();
    // console.log("6 **OnDestroy")
  }

}
