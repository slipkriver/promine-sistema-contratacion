import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-submenu',
  templateUrl: './header-submenu.component.html',
  styleUrls: ['./header-submenu.component.scss'],
})
export class HeaderSubmenuComponent implements OnInit {

  @Input("submenu") submenu:any[] | undefined;
  @Input("descripcion") descripcion:String | undefined;

  constructor() { }

  //submenu: any[] = []
  descripcionConst = "Seguimiento de aspirantes"

  ngOnInit() {
    //console.log(this.submenu)
  }

  selectOpcion(item:any) {
    //console.log(item)
    this.submenu?.forEach(element => {
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
