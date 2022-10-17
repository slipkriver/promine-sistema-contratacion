import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-submenu',
  templateUrl: './header-submenu.component.html',
  styleUrls: ['./header-submenu.component.scss'],
})
export class HeaderSubmenuComponent implements OnInit {

  @Input("submenu") submenu:any[];
  @Input("descripcion") descripcion:String;

  constructor() { }

  //submenu: any[] = []
  descripcionConst = "Seguimiento de aspirantes"

  ngOnInit() {
    //console.log(this.submenu)
  }

  selectOpcion(item) {
    //console.log(item)
    this.submenu.forEach(element => {
      element.activo = false
    });

    this.descripcion = item.descripcion
    item.activo = true
  }
  
 
  ionViewWillEnter() {
    this.descripcion = this.descripcionConst
    //console.log(this.descripcion)
  }

}
