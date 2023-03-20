import { Component, Input, OnInit, ViewChild } from '@angular/core';
//import {too} from '@angular/material/tooltip';

@Component({
  selector: 'app-list-observacion',
  templateUrl: './list-observacion.component.html',
  styleUrls: ['./list-observacion.component.scss'],
})
export class ListObservacionComponent implements OnInit {

  @ViewChild('popover') popover;
  @Input("verificado") verificado: Boolean;
  @Input("observaciones") listaObservaciones;

  observacionTxt = ''
  shownuevo = false;

  isOpen = false;

  constructor() { }

  ngOnInit() {
    //console.log(this.verificado)

  }

  chipClick(item, id?) {

    if (this.verificado) return;

    if (this.verificado == true) return;
    let x = `text-${id}`;
    //let y = document.getElementsByClassName(x);

    setTimeout(() => {
      //console.log(document.getElementById(x));
      let ioninput = document.getElementById(x).getElementsByClassName("native-textarea")[0] as HTMLTextAreaElement;
      ioninput.id = "native-text-" + id.toString();
      //el.focus();
      ioninput.focus()
      ioninput.select()
    }, 500);

    item.edit = true;
  }

  okItemClick(item, i?) {
    if (!!item && item != -1) {
      this.shownuevo = false;
      this.listaObservaciones.forEach(element => {
        element.edit = false;
      });
    } else if (item == -1) {
      this.listaObservaciones.push({ text: this.observacionTxt, edit: false });
      this.observacionTxt = '';
      this.shownuevo = false;
    }

  }

  nuevoClick(id?) {
    this.shownuevo = (this.shownuevo) ? false : true;
    this.isOpen = false;
    let x = `text-nuevo`;
    this.listaObservaciones.forEach(element => {
      element.edit = false;
    });

    if (this.shownuevo == false) return;
    setTimeout(() => {
      let ioninput = document.getElementById(x).getElementsByClassName("native-textarea")[0] as HTMLInputElement;
      //ioninput.id = "native-text-nuevo";
      //el.focus();
      ioninput.focus()
      ioninput.select()
    }, 500);
  }

  hideNuevo() {
    if(this.isOpen==true) return;
    setTimeout(() => {
      this.shownuevo = false
    }, 100);
  }

  delItemClick(index) {
    //delete this.listaObservaciones[item.id]
    this.listaObservaciones.splice(index, 1);
    //console.log(item)
  }


}
