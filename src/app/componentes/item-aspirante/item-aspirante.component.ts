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


}
