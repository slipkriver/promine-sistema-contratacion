
import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-buscar-aspirante',
  templateUrl: './buscar-aspirante.component.html',
  styleUrls: ['./buscar-aspirante.component.scss'],
})

export class BuscarAspiranteComponent implements OnInit {

  @Input("departamento") departamento;

  aspirantes = [];
  textobusqueda = "";


  constructor(
        private dataService: DataService,
  ) { }


  ngOnInit() { 

    //console.log(this.departamento)
    setTimeout(() => {
      //this.textobusqueda = "070";
    }, 4000);

  }


  buscarAspirante(event) {

    if (event.detail.value.length < 3) return

    this.aspirantes = []

    this.dataService.getListanuevos(event.detail.value).subscribe(res => {
      
      //console.log(res['result'][0])
      if (res['result'] && res['result'].length > 0) {
        this.aspirantes = res['result']
      }

    })

  }


  borrarBusqueda(){
    this.aspirantes = [];
  }


  opcionesTarea(item){

    this.dataService.aspOpciones$.emit( item )

  }

  
}
