import { Component, OnInit, ViewChild  } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { IonDatetime } from '@ionic/angular';


import { AspiranteInfo } from '../../interfaces/aspirante';
import { DataService } from '../../services/data.service';
import { EmpleadoInfo } from '../../interfaces/empleado';

@Component({
  selector: 'app-aspirante-medico',
  templateUrl: './aspirante-medico.page.html',
  styleUrls: ['./aspirante-medico.page.scss'],
})
export class AspiranteMedicoPage implements OnInit {

  aspirante  = <AspiranteInfo>{}
  empleado  = <EmpleadoInfo>{}


  @ViewChild(IonDatetime, { static: true }) datetime: IonDatetime;

  fechaEmision: Date = new Date();
  fechaDepartamentoMedico: Date = new Date();

  sexo: any[] = [];
  cargo: any[] = [];
  evaluacion: any[] = [];
  estado_aprobacion: any[] = [];
  condicion: any[] = [];
  departamentos: any[] = [];

  infogeneral: boolean = true;
  infoubicacion: boolean = true;
  infoconcepto: boolean = true;
  soloLectura: boolean = true

  dateValue = '';
  dateValue2 = '';

  listas = ['sexo', 'cargo', 'evaluacion', 'estado_aprobacion', 'condicion']


  constructor(
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController
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
      message: '<b>Guardando información... <b><br>Espere por favor',
      translucent: true,
      duration: 2000,
    });
    loading.present()

    console.log('INGRESO')

  }

  activarFormulario() {
    if (!this.soloLectura)

    this.soloLectura = (this.soloLectura) ? false : true
  }

  cambioFecha( event ) {

    console.log(event);
    console.log( new Date( event.detail.value ) );

  }

}
