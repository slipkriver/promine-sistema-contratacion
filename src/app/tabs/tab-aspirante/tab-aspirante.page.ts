import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-tab-aspirante',
  templateUrl: './tab-aspirante.page.html',
  styleUrls: ['./tab-aspirante.page.scss'],
})
export class TabAspirantePage implements OnInit {

  submenu: any[];
  descripcionConst = "Seguimiento de aspirantes"
  descripcion = ""

  constructor(
    private servicioData: DataService
  ) { }

  ngOnInit() {

    this.selectSubItem('inicio')

    this.servicioData.submenu$.subscribe(res => {
      //console.log(res);
      this.submenu = [];
      this.submenu = res;
    })

    this.servicioData.cambioMenu$.subscribe(res => {
      //console.log(res);
      this.selectOpcion2(res);
    })

  }

  selectSubItem(item) {
    this.servicioData.getSubMenu(item)
    //console.log( this.submenu)

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


  ionViewWillEnter() {
    this.selectSubItem('aspirante')
    this.descripcion = this.descripcionConst
    //console.log(this.descripcion)
  }


  ionViewWillLeave() {
    this.submenu = []
    // console.log('**EXIT', this.submenu)
  }


}
