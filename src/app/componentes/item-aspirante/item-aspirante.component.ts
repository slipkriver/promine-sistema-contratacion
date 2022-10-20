import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-aspirante',
  templateUrl: './item-aspirante.component.html',
  styleUrls: ['./item-aspirante.component.scss'],
})
export class ItemAspiranteComponent implements OnInit {


  @Input("aspirante") aspirante;
  @Input("index") index;


  constructor( ) { }

  ngOnInit() {}


}
