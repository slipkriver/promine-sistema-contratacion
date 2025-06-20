import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-aspirante',
  templateUrl: './loading-aspirante.component.html',
  styleUrls: ['./loading-aspirante.component.scss'],
})
export class LoadingAspiranteComponent implements OnInit {

  @Input("lista") lista:boolean = false;

  constructor() { }

  ngOnInit() {}

}
