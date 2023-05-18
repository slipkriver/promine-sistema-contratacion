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

  constructor(
    private servicioData: DataService
  ) { }

  ngOnInit() {

    //const role = this.servicioData.dataLocal.userConfig.user.role;

    //this.submenu = this.servicioData.submenu;


  }

  async getSubmenu() {
    await this.servicioData.getSubMenu();
    // console.log(this.tabsList);

  }


  selectOpcion(item) {
    //console.log(item)
    this.submenu.forEach(element => {
      element.activo = false
    });

    this.descripcion = item.descripcion
    item.activo = true
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
    // console.log("1 **ngAfterContentInit")
    this.descripcion = this.descripcionConst;
  }

  ngAfterViewInit() {
    // console.log("2 **ngAfterViewInit")
  }

  ionViewWillEnter() {
    // console.log('3 **ionViewWillEnter')
    this.servicioData.submenu$.subscribe((list:any[]) => {
      this.submenu = list
      setTimeout(() => {
        //console.log(this.submenu[0].ruta);
        this.tabsList.select(this.submenu[1].ruta)
      }, 500);

    });
  }

  ionViewDidEnter() {
    this.getSubmenu();
    // console.log('4 **ionViewDidEnter')
  }


  ionViewDidLeave() {
    this.submenu = []
    // console.log('5 **ionViewWillLeave **EXIT')
  }
  
  
  
  
  OnDestroy() {
    this.servicioData.submenu$.complete();
    // console.log("6 **OnDestroy")
  }

}
