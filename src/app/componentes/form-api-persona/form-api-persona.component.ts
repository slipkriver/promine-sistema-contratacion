import { Component, Input, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-form-api-persona',
  templateUrl: './form-api-persona.component.html',
  styleUrls: ['./form-api-persona.component.scss'],
})
export class FormApiPersonaComponent implements OnInit {

  @Input("dni") dni: any;

  formSelect = "inicio";

  infoData;

  buscandoPersona=false;

  selectItems = [
    'per_nombre',
    'per_fnacimiento',
    'per_edad',
    'per_ciudadania',
    'per_genero',
    'per_ecivil',
    'per_profesion',
    'per_direccion'
  ];

  constructor(
    private dataService: DataService,

  ) { }

  ngOnInit() {

    // console.log(this.dni);

  }

  consultarInfo() {
    //this.dni = "0704116375"
    this.buscandoPersona=true;
    this.dataService.getPersonaDni(this.dni).subscribe((data: any) => {
      // console.log(this.dni, data);
      if (data?.per_dni) {
        this.infoData = data;
        this.infoData.per_familiar = JSON.parse(this.infoData.per_familiar);
        this.infoData.contactos.con_telefono = JSON.parse(this.infoData.contactos.con_telefono);
        this.infoData.contactos.con_direccion = JSON.parse(this.infoData.contactos.con_direccion);
      }
      this.buscandoPersona=false;
      this.formSelect = "general";
    })
  }

  cambiarCategoria(evento) {

    this.formSelect = evento.detail.value;
    // console.log(this.formSelect);

  }

  setIteminfo(campo) {

    const campos = this.selectItems;

    if (campos.includes(campo)) {
      console.log("includes", campo);
      const index = campos.indexOf(campo);
      if (index !== -1) {
        this.selectItems.splice(index, 1);
      }
    } else {
      this.selectItems.push(campo)
    }
  }
  
  onClick(){
    
  }

}