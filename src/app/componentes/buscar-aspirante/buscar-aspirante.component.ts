
import { Component, Input } from '@angular/core';
import { DataService } from 'src/app/services/data.service';


@Component({
  selector: 'app-buscar-aspirante',
  templateUrl: './buscar-aspirante.component.html',
  styleUrls: ['./buscar-aspirante.component.scss']
})

export class BuscarAspiranteComponent {

  @Input("departamento") departamento;

  aspirantes = [];
  textobusqueda = "";


  constructor(
        private dataService: DataService
  ) { }


  buscarAspirante(event) {

    if (event.detail.value.length < 3) return

    this.aspirantes = []

    this.dataService.getListanuevos(event.detail.value).subscribe((res:any) => {
      
      //console.log(res)
      if (res['result'] && res['result'].length > 0) {
        this.aspirantes = res['result']
      }

    })

  }


  borrarBusqueda(){
    this.aspirantes = [];
  }


  opcionesTarea(item:any){
    item.atv_verificado = true;
    this.dataService.aspOpciones$.emit( {... item, departamento:this.departamento } )

  }

  
}
