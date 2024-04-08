import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-list-cargos',
  templateUrl: './list-cargos.component.html',
  styleUrls: ['./list-cargos.component.scss'],
})
export class ListCargosComponent implements OnInit {

  @Input("cargos") cargos:any;
  @Input("cargo") cargo={car_nombre:"",car_area:"", car_id:0};

  txtBusqueda = ""
  filterList = [];
  nuevoCargo = { nombre: "", area: "" };
  nuevaArea = "";

  listaCargos = [];

  constructor(
    private modalController: ModalController
  ) { }

  ngOnInit() {
    
    this.listaCargos = JSON.parse(JSON.stringify(this.cargos))
    /*this.listaCargos.forEach(element => {
      element.nombre = `${element.nombre} - ${element.area}`
      //this.listaCargos.push( element )
    });*/

    setTimeout(() => {

    }, 2000);

  }

  ionViewDidEnter() {
    if (!!this.cargo.car_nombre) {
      this.txtBusqueda = this.cargo.car_nombre.trim();

      const x = this.cargo
    
      const cargo_asp = this.listaCargos.find(function (item) {
        return (item.car_nombre === x.car_nombre && item.car_area === x.car_area)
      });
      //this.cargo['id'] = cargo_asp.car_id;
      this.cargo = cargo_asp;
      
      // this.nuevoCargo = this.cargo;
      this.nuevoCargo = cargo_asp;
      // console.log(this.cargo, "cargo_asp X=", this.nuevoCargo)
      //this.buscarCargo(this.txtBusqueda)
      this.setCargo(this.cargo)
    }
    setTimeout(() => {

      let ionsearchbar = document.getElementById("input-buscar")?.getElementsByClassName("searchbar-input-container")[0];
      let ioninput = ionsearchbar?.getElementsByClassName("searchbar-input")[0] as HTMLInputElement
      // console.log(ionsearchbar, ioninput);
      ioninput.focus()
      ioninput.select()

    }, 500);
  }

  buscarCargo(texto?:string) {
    if (this.txtBusqueda.length < 2) return;

    let txtBusqueda = texto || this.txtBusqueda;
    //if(texto) txtBusqueda=texto;
    //console.log(texto, txtBusqueda, this.txtBusqueda.length)

    this.filterList = this.listaCargos.filter(filtrarCargo);

    // console.log(this.filterList)
    function filtrarCargo(element, value, array) {
      //console.log(element, value, array)
      return (element.car_nombre.includes(txtBusqueda.toUpperCase()));
    }
  }



  setCargo(item) {
    // this.txtBusqueda = item.nombre;
    // Object.assign(this.nuevoCargo,item);
    this.nuevoCargo = { ...item }
    // console.log(item, this.nuevoCargo);
  }


  cerrarModal(guardar) {
    /*if (guardar) {
      this.nuevoCargo
    } else {
      this.cargo
    };*/

    // console.log(this.cargo, this.nuevoCargo)
    this.modalController.dismiss({
      cargo: (guardar) ? this.nuevoCargo : this.cargo
    });
    delete this.listaCargos;
  }

}
