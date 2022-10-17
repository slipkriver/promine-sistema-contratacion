import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { AspiranteInfo } from '../../interfaces/aspirante';
import { AspiranteSoci  } from '../../interfaces/aspirante-soci';

import { LoadingController, NavController } from '@ionic/angular';
import { EmpleadoInfo } from 'src/app/interfaces/empleado';

@Component({
  selector: 'app-aspirante-social',
  templateUrl: './aspirante-social.page.html',
  styleUrls: ['./aspirante-social.page.scss'],
})
export class AspiranteSocialPage implements OnInit {

  aspirante = <AspiranteInfo>{}
  empleado = <EmpleadoInfo>{}

  fechaEntrevista: Date = new Date();
  fechaIngreso: Date = new Date();
  fechaDepartamento: Date = new Date();
  fechaNacimiento: Date = new Date();

  estado: any[] = [];
  departamentos: any[] = [];
  paises: any[] = [];
  sexo: any[] = [];
  civil: any[] = [];
  tipo_sangre: any[] = [];
  cargo: any[] = [];
  referencia: any[] = [];
  academico: any[] = [];
  etnia: any[] = [];
  vivienda: any[] = [];
  construccion: any[] = [];

  infogeneral: boolean = true;
  infoubicacion: boolean = true;
  infovivienda: boolean = true;
  infodepartamento: boolean = true;
  mensajecedula: string = '';
  ci_valida: boolean = true;
  soloLectura: boolean = true

  listas = ['estado', 'paises', 'sexo', 'civil', 'tipo_sangre', 'cargo', 'referencia', 'academico', 'etnia', 'vivienda', 'construccion']

  constructor(
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) { }

  ngOnInit() {

    this.listas.forEach(element => {

      this.dataService.getAspiranteLData(element).subscribe(lista => {
        this[element] = lista;
        //console.log(this.estado);
      });

    });


    this.dataService.getEmpleadoLData('departamento').subscribe(departamentos => {
      this.departamentos = departamentos;
    });

  }

  ionViewWillEnter() {

    if(!!this.dataService.aspirante)
      this.aspirante = this.dataService.aspirante
    //console.log(this.dataService.aspirante)

  }


  mostrarContenido(contenido) {

    this[contenido] = (this[contenido]) ? false : true

  }

  cambioFecha(event) {

    console.log(event);
    console.log(new Date(event.detail.value));

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

  async onSubmitTemplate() {
    const loading = await this.loadingCtrl.create({
      message: '<b>Guardando información... <b><br>Espere por favor',
      translucent: true,
      duration: 2000,
    });
    loading.present()

    let objAspirante = new AspiranteSoci()
    //type objAspirante = typeof AspiranteSoci;
    Object.keys(objAspirante).map(key => {
      //console.log(key)  
      objAspirante[key] = this.aspirante[key];
      //return { text: key, value: key }
    });
    
    this.dataService.verifySocial(objAspirante).subscribe( res => {
      console.log(res)
    })
    //console.log('INGRESO', objAspirante)

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


  activarFormulario() {
    if (!this.soloLectura) {
      return
    }
    this.soloLectura = (this.soloLectura) ? false : true
  }

  cancelarSolicitud() {
    this.navCtrl.navigateBack(['/inicio']);

  }


}
