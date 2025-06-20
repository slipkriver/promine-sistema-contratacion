import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonTabs } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab-aspirante',
  templateUrl: './tab-aspirante.page.html',
  styleUrls: ['./tab-aspirante.page.scss'],
})
export class TabAspirantePage {

  @ViewChild(IonTabs) tabsList: IonTabs | undefined;

  submenu: any[] = [];
  descripcionConst = "Seguimiento de aspirantes"
  descripcion = ""

  idsubmenu = 0;

  constructor(
    private servicioData: DataService,
    private router: Router
  ) { }

  ngOnInit() {

    //const role = this.servicioData.dataLocal.userConfig.user.role;

    //this.submenu = this.servicioData.submenu;
    this.getSubmenu();

    this.servicioData.submenu$.subscribe((list) => {
      //this.submenu = list;
      this.submenu = list;
      // console.log('tab-aspitante',this.idsubmenu,this.servicioData.submenu);
      this.selectOpcion(this.submenu[this.idsubmenu], this.idsubmenu)


    });

  }

  getSubmenu() {

    this.servicioData.getSubMenu()
    // console.log(this.tabsList);


  }


  selectOpcion(item, index) {
    // console.log(item, index)
    this.submenu.forEach(element => {
      element.activo = false
    })

    //this.tabsList.select(this.submenu[index].ruta)
    item.activo = true
    this.descripcion = item.descripcion;
    this.idsubmenu = index;

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
    // this.getSubmenu()
    this.descripcion = this.descripcionConst;
  }

  ngAfterViewInit() {
    // console.log("2 **ngAfterViewInit", this.submenu, this.servicioData.submenu.length)
  }

  ionViewWillEnter() {
    // console.log('3 **ionViewWillEnter', this.idsubmenu, this.servicioData.submenu)
    this.submenu = this.servicioData.submenu;
    const varRuta = this.router.url
    
    if(varRuta.endsWith("aspirante-home")){
      //return
    }

    const itemSubmenu = this.submenu.find(function (item) {
      return varRuta.endsWith(item.ruta)
    });

    const index = this.submenu.indexOf(itemSubmenu)
    // console.log(this.router.url, this.servicioData.submenu.length, itemSubmenu, index, "/"+this.submenu[0].ruta);
    if (itemSubmenu) {
      this.selectOpcion(itemSubmenu, index)
    } else {
      // this.selectOpcion(this.submenu[0], 0)
      this.tabsList.select(this.submenu[0].ruta)
      // this.router.navigate([this.router.url])
    }
    //this.submenu = this.servicioData.submenu

  }

  ionViewDidEnter() {
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
