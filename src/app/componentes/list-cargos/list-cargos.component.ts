import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list-cargos',
  templateUrl: './list-cargos.component.html',
  styleUrls: ['./list-cargos.component.scss'],
})
export class ListCargosComponent implements OnInit {

  @Input("cargos") cargos;
  @Input("cargo") cargo = "";

  txtBusqueda = ""
  filterList = [];
  nuevoCargo = ""

  listaCargos = []

  constructor(
    public modalController: ModalController
  ) { }

  ngOnInit() {
    //console.log(this.cargos[1])

    this.listaCargos = JSON.parse( JSON.stringify(this.cargos) )
    this.listaCargos.forEach(element => {
      element.nombre = `${element.nombre} - ${element.area}`
      //this.listaCargos.push( element )
    });

    setTimeout(() => {

    }, 2000);

  }

  ionViewDidEnter() {
    if (this.cargo) {
      this.txtBusqueda = this.cargo.split(" ", 1)[0].trim();
      this.nuevoCargo = this.cargo.toUpperCase();
      this.buscarCargo(this.txtBusqueda)
    }
    setTimeout(() => {

      let ionsearchbar = document.getElementById("input-buscar").getElementsByClassName("searchbar-input-container")[0];
      let ioninput = ionsearchbar.getElementsByClassName("searchbar-input")[0] as HTMLInputElement
      // console.log(ionsearchbar, ioninput);
      ioninput.focus()
      ioninput.select()

    }, 500);
  }

  buscarCargo(texto?) {
    if (this.txtBusqueda.length < 2) return;

    let txtBusqueda = texto || this.txtBusqueda;
    //if(texto) txtBusqueda=texto;
    //console.log(texto, txtBusqueda, this.txtBusqueda.length)

    this.filterList = this.listaCargos.filter(filtrarCargo);

    // console.log(this.filterList)
    function filtrarCargo(element, value, array) {
      //console.log(x)
      return (element.nombre.includes(txtBusqueda.toUpperCase()));
    }
  }



  setCargo(item) {
    // this.txtBusqueda = item.nombre;
    this.nuevoCargo = item.nombre ;
  }


  cerrarModal(guardar) {
    this.cargo = (guardar) ? this.nuevoCargo : this.cargo;
    
    this.modalController.dismiss({
      cargo: this.cargo
    });
    //console.log(this.cargo)
    delete this.listaCargos;
  }

}
