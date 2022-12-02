import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-list-observacion',
  templateUrl: './list-observacion.component.html',
  styleUrls: ['./list-observacion.component.scss'],
})
export class ListObservacionComponent implements OnInit {
  
  @ViewChild('popover') popover;
  @Input("verificado") verificado:Boolean;
  @Input("observaciones") listaObservaciones;

  observacionTxt = ''
  shownuevo = false;
  showinfopopover = false;

  isOpen = false;

  constructor() { }

  ngOnInit() {
    //console.log(this.verificado)

  }

  chipClick(item, id?) {
    
    if(this.verificado) return;

    this.hideNuevo();

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
    if(this.showinfopopover==true) return;
    
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
    this.isOpen=false;
    let x = `text-nuevo`;
    this.listaObservaciones.forEach(element => {
      element.edit = false;
    });

    if(this.shownuevo== false) return;
    setTimeout(() => {
      let ioninput = document.getElementById(x).getElementsByClassName("native-textarea")[0] as HTMLInputElement;
      //ioninput.id = "native-text-nuevo";
      //el.focus();
      ioninput.focus()
      ioninput.select()
    }, 500);
  }

  delItemClick(index) {
    //delete this.listaObservaciones[item.id]
    this.listaObservaciones.splice(index, 1);
    //console.log(item)
  }

  hideNuevo() {
    if(this.isOpen==true) return;
    setTimeout(() => {
      this.shownuevo = false
    }, 100);
  }

  presentPopover(e : Event) {
    if (this.isOpen == true ) return;
    this.showinfopopover = true;
    setTimeout(() => {      
      if(this.showinfopopover == false) return;
      this.popover.event = e;
      
      this.isOpen = true;
      //this.popoverComponente( e )
    }, 1000);
  }

  async popoverComponente(ev: any) {
    // const popover = await this.popoverController.create({
    //   component: PopoverInfoComponent,
    //   //componentProps:{ submenu:[],descripcion:'test pop-over'},
    //   event: ev,
    //   mode: "ios",
    //   cssClass:"popover-info",
    //   translucent: false,
    //   showBackdrop: false
    // });
  
    // await popover.present();
  }
  hidePopover() {
    //console.log("HIDE", this.isOpen)
    this.showinfopopover = false;
    if (this.isOpen == false) return;
    //this.popover.event = e;
    this.isOpen = false;
  }

}
