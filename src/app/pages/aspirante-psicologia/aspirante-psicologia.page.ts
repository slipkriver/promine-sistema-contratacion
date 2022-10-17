import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';

import { AspiranteInfo } from '../../interfaces/aspirante';
import { EmpleadoInfo } from '../../interfaces/empleado';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-aspirante-psicologia',
  templateUrl: './aspirante-psicologia.page.html',
  styleUrls: ['./aspirante-psicologia.page.scss'],
})
export class AspirantePsicologiaPage implements OnInit {

  aspirante  = <AspiranteInfo>{}
  empleado = <EmpleadoInfo>{}

  
  fechaEntrevista: Date = new Date();
  fechaNacimiento: Date = new Date();
  fechaDepartamentoPsicologia: Date = new Date();
  
  academico: any[] = []; 
  militar: any[] = [];
  cargo: any[] = [];
  estado_aprobacion: any[] = [];
  departamentos: any[] = [];
  

  
  infogeneral: boolean = true;
  infoubicacion: boolean = true;
  infoconcepto: boolean = true;
  mensajecedula: string = '';
  ci_valida: boolean = true;
  soloLectura: boolean = true

  listas = ['academico', 'militar', 'cargo', 'estado_aprobacion']
 
  constructor( 
    private loadingCtrl: LoadingController,
    private dataService: DataService
   ) { }

  ngOnInit() {

    this.listas.forEach(element => {

      this.dataService.getAspiranteLData(element).subscribe(lista => {

        this[element] = lista;

      });

    });

    
    this.dataService.getEmpleadoLData('departamento').subscribe(departamentos => {
      this.departamentos = departamentos;
    });

  }

  mostrarContenido(contenido) {
   
    this[contenido] = (this[contenido]) ? false : true

  }
  async onSubmitTemplate() {
    const loading = await this.loadingCtrl.create({
      message: '<b>Guardando información del Productor... <b><br>Espere por favor',
      translucent: true,
      duration: 2000,
    });
    loading.present()

    console.log('INGRESO')

  }
  getDate(){

    let date: Date = new Date();
    console.log("Date = " + date);
  }
  verificarci(evento) {
    var cedula: string = evento.detail.value

    if (cedula.length == 10) {
      var d10 = cedula[9]
      if (parseInt(d10) == this.getDigitoV(cedula)) {
        this.mensajecedula = 'si'
        this.ci_valida = true
      }
      else {
        this.mensajecedula = 'no'
        this.ci_valida = false
      }
    }
    else
      this.mensajecedula = ''

    //console.log(this.ci_valida)
  }
  
  getDigitoV(cedula) {
    var x = 0, spar = 0, simp = 0;
    var flag: Boolean = true

    for (let i = 0; i < 9; i++) {
      if (flag) {
        x = parseInt(cedula[i]);
        x *= 2;
        if (x > 9)
          x -= 9;
        simp += x;
        flag = false
      }
      else {
        x = parseInt(cedula[i]);
        spar += x;
        flag = true
      }
    }
    var decenaInt = (Math.trunc((spar + simp) / 10) + 1) * 10;
    decenaInt -= (spar + simp);
    //console.log(decenaInt)
    return (decenaInt == 10) ? 0 : decenaInt;
  }

  actualizarvalor(evento, variable) {
    if (evento.detail.checked == false) {
      this.aspirante[variable] = 'NO'
      this[variable] = false
    }
    else
      this.aspirante[variable] = 'SI'
    this[variable] = true
    //console.log(this.productor[variable], ' -> ', variable)
  }

  cambioFecha( event ) {

    console.log(event);
    console.log( new Date( event.detail.value ) );

  }

}
