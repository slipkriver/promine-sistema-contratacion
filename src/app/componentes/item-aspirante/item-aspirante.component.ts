import { Component, Input, OnInit } from '@angular/core';

import { addIcons } from 'ionicons';

@Component({
  selector: 'app-item-aspirante',
  templateUrl: './item-aspirante.component.html',
  styleUrls: ['./item-aspirante.component.scss'],
})
export class ItemAspiranteComponent implements OnInit {


  @Input("aspirante") aspirante;
  @Input("index") index;


  constructor( ) { 

    addIcons({
      'banner-item': 'assets/icon/banner-item.svg',
      'banner-item-outline': 'assets/icon/banner-item-outline.svg',
      //'flag-de': 'assets/flags/de.svg'
    });

  }

  ngOnInit() {}

  getUrlFoto(){
    if(this.aspirante.asp_url_foto){
      return this.aspirante.asp_url_foto.replace('..','https://getssoma.com');
    }else{
      //console.log(this.aspirante.asp_sexo)
      if(this.aspirante.asp_sexo == 'MASCULINO'){
        return 'assets/icon/personm.png'
      }else{
        return 'assets/icon/personf.png'
      }
    }
  }

}
