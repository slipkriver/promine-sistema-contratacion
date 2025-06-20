import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
// import { ViewWillEnter } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-form-principal',
  templateUrl: './form-principal.component.html',
  styleUrls: ['./form-principal.component.scss'],
})
export class FormPrincipalComponent {

  @Input("departamento") departamento;
  // @Input("estado") estado;
  @Input("estado_nuevo") estado_nuevo;
  @Output() clicAspirante = new EventEmitter();

  estado = { id: 0, historial: false }; //= this.estado_nuevo;
  estados = []; //= this.estado_nuevo;

  //estado_nuevo = 2;
  //departamento='medi';
  aspirantesNuevo = [];
  listaTareas = [];
  numNotificaciones = 0;
  contPagina = 0;
  numPaginas = 1;
  loadingData = true;
  loadingList = [];
  showHistorial = false;
  timeoutId;

  viewList: boolean = false;

  constructor(
    private dataService: DataService

  ) {
  }

  ngOnInit() {
    // console.log('ngOnInit >> form-principal');
    //this.numPaginas = 1;
    this.estado.id = this.estado_nuevo

    let item_estado = { id: this.estado_nuevo, historial: false }
    this.estados.push(item_estado)
    item_estado = { id: this.estado_nuevo + 2, historial: false }
    this.estados.push(item_estado)
    item_estado = { id: this.estado_nuevo + 1, historial: false }
    this.estados.push(item_estado)
    //this.dataService.servicio_listo = true;
    // console.log(this.estados);

    this.dataService.mostrarLoading$.emit(true)

    // setTimeout(() => {
    this.dataService.aspirantes$.subscribe(resp => {
      // console.log('EVENT subscribe() >> form-principal, resp=', resp, this.listaTareas.length, this.departamento, this.estado, this.showHistorial);
      this.contPagina=0
      if (resp == true || this.listaTareas.length==0) {
        const listaFiltrada = this.dataService.filterAspirantes(this.departamento, this.estado.id, this.estado.historial).aspirantes;
        this.listaTareas = this.formatAspirantes(listaFiltrada);
        this.setAspirantesData(true)
      }
      this.stopLoading();

    })

    this.setInitData();
    // }, 2000);



  }


  async setInitData() {

    //this.listarAspirantes(this.estado);
  }

  ngAfterViewInit() {
    // console.log(" Fprm-princ -> ngAfterViewInit()")
    // this.contPagina = 1;
    //this.dataService.aspItemOpts$.unsubscribe();
  }

  ionViewWillEnter() {
    console.log(" Fprm-princ -> ionViewWillEnter()")
    this.contPagina = 0;
    //this.dataService.aspItemOpts$.unsubscribe();
  }


  listarAspirantes(estado?) {

    // console.log(this.estado, "STOP **loading data", this.departamento, "seg **", estado, this.showHistorial, this.estado_nuevo,);
    //const estados_aprobado = [1, 2, 4, 6, 8, 10, 12, 14]
    if (estado.id == this.estado_nuevo) {
      this.showHistorial = false;
    }
    /*if (estado.id != this.estado) {
      this.showHistorial = false;
    }*/

    const aspirantes = this.dataService.filterAspirantes(this.departamento, estado.id, estado.historial).aspirantes;
    this.aspirantesNuevo = [];
    this.contPagina = 0;


    this.timeoutId = setTimeout(() => {
      this.stopLoading()
    }, 8000)


    this.estado = estado;
    this.listaTareas = this.formatAspirantes(aspirantes);

    const numCards = (aspirantes.length > 5) ? 1 : 6 - this.listaTareas.length;

    for (let index: number = 0; index < numCards; index++) {
      this.loadingList.push(1 + index);
    }

    this.loadingData = true;

    if (numCards > 0) {
      this.aspirantesNuevo = this.listaTareas.slice(0, 5);
      this.numPaginas = Math.ceil(this.listaTareas.length / (this.viewList ? 12 : 6)) || 1;
    }

    this.setAspirantesData();
    this.dataService.getAspirantesApi('form-principal COMP ');

  }


  formatAspirantes(aspirantes) {
    let est_color = "#2fdf75";
    const lista_update = JSON.parse(JSON.stringify(aspirantes));

    if (this.estado.id == this.estados[1].id) {
      est_color = "#3171e0"   //Aprobado
    } else if (this.estado.id == this.estados[2].id) {
      est_color = "#eb445a"   //NO arobado
    }
    lista_update.forEach((element: any) => {
      element.est_color = est_color;
    });
    return lista_update;
  }


  setAspirantesData(fromApi = false) {
    const id = this.estado.id;

    if (id == this.estado_nuevo) {
      this.numNotificaciones = this.listaTareas.length
    }

    this.numPaginas = Math.ceil(this.listaTareas.length / (this.viewList ? 12 : 6)) || 1;

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
      this.aspirantesNuevo = this.listaTareas.slice(0, (this.viewList ? 12 : 6));
    }, 500);

  }

  aspiranteOpciones(item: any) {
    // console.log( item );
    this.clicAspirante.emit(item);
  }


  updatePagina(value: any) {
    this.contPagina = this.contPagina + value;
    //console.log(this.contPagina*4,(this.contPagina+1)*4)
    this.aspirantesNuevo = this.listaTareas.slice(this.contPagina * (this.viewList ? 12 : 6), (this.contPagina + 1) * (this.viewList ? 12 : 6));
  }

  mostrarHistorial() {
    // this.showHistorial = (this.showHistorial) ? false : true;
    this.estado.historial = (this.estado.historial) ? false : true;
    this.showHistorial = this.estado.historial;
    const index = this.estados.findIndex((item: any) => item.id === this.estado.id)
    if (index) {
      this.estados[index] = this.estado;
    }
    this.listarAspirantes(this.estado)
    // }
  }

  cambiarVista() {
    this.viewList = (this.viewList) ? false : true;
    this.listarAspirantes(this.estado)
  }

}
