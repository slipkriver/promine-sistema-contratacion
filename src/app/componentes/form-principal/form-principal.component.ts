import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-form-principal',
  templateUrl: './form-principal.component.html',
  styleUrls: ['./form-principal.component.scss'],
})
export class FormPrincipalComponent implements OnInit {

  @Input("departamento") departamento;
  // @Input("estado") estado;
  @Input("estado_nuevo") estado_nuevo;
  @Output() clicOpciones = new EventEmitter();

  estado //= this.estado_nuevo;
  //estado_nuevo = 2;
  //departamento='medi';
  aspirantesNuevo = [];
  listaTareas: any[] = [];
  numNotificaciones = 0;
  contPagina = 0;
  numPaginas = 1;
  loadingData = true;
  loadingList = [];
  showHistorial = false;
  timeoutId: NodeJS.Timeout;

  constructor(
    private dataService: DataService,

  ) {
  }

  ngOnInit() {

    this.estado = this.estado_nuevo
    this.dataService.servicio_listo = true;
    this.dataService.mostrarLoading$.emit(true)
    //console.log(this.estado, this.estado_nuevo, this.departamento);
    
    this.dataService.aspirantes$.subscribe(resp => {
      if (resp == true) {
        const listaFiltrada = this.dataService.filterAspirantes(this.departamento, this.estado, this.showHistorial).aspirantes;
        this.listaTareas = this.formatAspirantes(listaFiltrada);
        this.setAspirantesData(true)
      }
      this.stopLoading();

    });

    this.setInitData();

  }


  ionViewWillEnter() {
    //this.dataService.setSubmenu('Departamento Medico');
    this.contPagina = 0;
    // console.log(this.estado);

  }

  async setInitData() {
    this.listarAspirantes(this.estado);
  }


  listarAspirantes(estado?) {

    //const estados_aprobado = [1, 2, 4, 6, 8, 10, 12, 14]
    if (estado == this.estado_nuevo) {
      this.showHistorial = false;
    }
    
    const aspirantes = this.dataService.filterAspirantes(this.departamento, estado, this.showHistorial).aspirantes;
    this.aspirantesNuevo = [];
    this.contPagina = 0;

    //console.log(this.estado,"STOP **loading data", this.departamento, "seg **", estado, this.estado_nuevo,);
    this.timeoutId = setTimeout(() => {
      this.stopLoading()
    }, 8000)


    this.estado = estado;
    this.listaTareas = this.formatAspirantes(aspirantes);

    const numCards = (aspirantes.length > 5) ? 1 : 6 - this.listaTareas.length;

    for (let index = 0; index < numCards; index++) {
      this.loadingList.push(1 + index);
    }

    this.loadingData = true;

    if (numCards > 0) {
      this.aspirantesNuevo = this.listaTareas.slice(0, 5);
      this.numPaginas = Math.ceil(this.listaTareas.length / 6) || 1;
    }

    this.setAspirantesData();
    this.dataService.getAspirantesApi();

  }


  formatAspirantes(aspirantes) {
    let est_color = "#2fdf75";
    const lista_update = JSON.parse(JSON.stringify(aspirantes));

    if (this.estado == this.estado_nuevo + 2) {
      est_color = "#3171e0"   //Aprobado
    } else if (this.estado == this.estado_nuevo + 1) {
      est_color = "#eb445a"   //NO arobado
    }
    lista_update.forEach(element => {
      element.est_color = est_color;
    });
    return lista_update;
  }


  setAspirantesData(fromApi = false) {
    const id = this.estado;

    if (id == this.estado_nuevo) {
      this.numNotificaciones = this.listaTareas.length
    }

    this.numPaginas = Math.ceil(this.listaTareas.length / 6) || 1;

    if (fromApi) {
      // console.log("GET Api <<< ", { fromApi })
      clearTimeout(this.timeoutId)
    }

  }


  stopLoading() {
    // //console.log("Timer @@@ --> ", this.timeoutId)
    clearTimeout(this.timeoutId)
    setTimeout(() => {
      this.dataService.mostrarLoading$.emit(false)
      this.loadingData = false;
      this.loadingList = [];
      this.aspirantesNuevo = this.listaTareas.slice(0, 6);
    }, 500);

  }

  aspiranteOpciones(item) {
    this.clicOpciones.emit(item);
  }


  updatePagina(value) {
    this.contPagina = this.contPagina + value;
    //console.log(this.contPagina*4,(this.contPagina+1)*4)
    this.aspirantesNuevo = this.listaTareas.slice(this.contPagina * 6, (this.contPagina + 1) * 6);
  }

  mostrarHistorial() {
    this.showHistorial = (this.showHistorial) ? false : true;
    this.listarAspirantes(this.estado)
    // }
  }


}
