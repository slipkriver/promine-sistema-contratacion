import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { DataService } from 'src/app/services/data.service';
import { FormValidarLegalComponent } from '../../componentes/form-validar-legal/form-validar-legal.component';

@Component({
  selector: 'app-principal-legal',
  templateUrl: './principal-legal.page.html',
  styleUrls: ['./principal-legal.page.scss'],
})
export class PrincipalLegalPage implements OnInit {

  aspirantesNuevo = [];
  estado = 9;

  listaTareas: any[] = [];

  textobusqueda = ""

  numNotificaciones = 0;

  contPagina = 0;
  numPaginas = 1;
  loadingData = true;
  loadingList = [];
  showHistorial = false;
  timeoutId: NodeJS.Timeout;


  constructor(
    private actionSheetCtr: ActionSheetController,
    private modalController: ModalController,
    private dataService: DataService,
    private router: Router,
  ) { }


  ngOnInit() {

    this.dataService.servicio_listo = true;
    this.dataService.mostrarLoading$.emit(true)

    this.dataService.aspirantes$.subscribe(resp => {
      if (resp == true) {
        const listaFiltrada = this.dataService.filterAspirantes('legal', this.estado, this.showHistorial).aspirantes;
        this.listaTareas = this.formatAspirantes(listaFiltrada);
        this.setAspirantesData(true)
      }
      this.stopLoading();

    });

    this.setInitData();

  }


  ionViewWillEnter() {
    this.dataService.setSubmenu('Legal');
    this.contPagina = 0;

  }

  async setInitData() {
    this.listarAspirantes(this.estado);
    // this.listarAspirantes({ est_id: 0 });
  }


  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }


  listarAspirantes(estado?) {
    //this.loadingList = [1, 2, 3, 4, 5, 6];
    const aspirantes = this.dataService.filterAspirantes('legal', estado, this.showHistorial).aspirantes;
    this.aspirantesNuevo = [];
    this.contPagina = 0;

    this.timeoutId = setTimeout(() => {
      //console.log("STOP **loading data", "   time up: ", 5, "seg");
      this.stopLoading()
    }, 8000)
    //let estado;


    if (estado == 9) {
      this.showHistorial = false;
    }

    this.estado = estado;
    this.listaTareas = this.formatAspirantes(aspirantes);

    const numCards = (aspirantes.length > 5) ? 1 : 6 - this.listaTareas.length;

    for (let index = 0; index < numCards; index++) {
      this.loadingList.push(1 + index);
    }

    this.loadingData = true;

    if (numCards > 0) {
      this.numNotificaciones = (estado == 0) ? this.listaTareas.length : this.numNotificaciones;
      this.aspirantesNuevo = this.listaTareas.slice(0, 5);
      this.numPaginas = Math.ceil(this.listaTareas.length / 6) || 1;
    }

    this.setAspirantesData();
    this.dataService.getAspirantesApi();

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


  formatAspirantes(aspirantes) {
    let est_color = "#2fdf75";
    const lista_update = JSON.parse(JSON.stringify(aspirantes)) ;

    if (this.estado == 10) {
      est_color = "#3171e0"   //Aprobado
    } else if(this.estado == 11) {
      est_color = "#eb445a"   //NO arobado
    }
    lista_update.forEach(element => {
      element.est_color = est_color;
    });
    return lista_update;
  }

  setAspirantesData(fromApi = false) {
    const id = this.estado;

    if (id == 9) {
      this.numNotificaciones = this.listaTareas.length
    }

    this.numPaginas = Math.ceil(this.listaTareas.length / 6) || 1;

    if (fromApi) {
      // console.log("GET Api <<< ", { fromApi })
      clearTimeout(this.timeoutId)
    }

  }


  updatePagina(value) {
    this.contPagina = this.contPagina + value;
    //console.log(this.contPagina*4,(this.contPagina+1)*4)
    this.aspirantesNuevo = this.listaTareas.slice(this.contPagina * 4, (this.contPagina + 1) * 4);
  }

  async opcionesTarea(aspirante) {

    // const apto = (aspirante.asp_estado == 9) ? false : true;
    // const x = this.dataService.getItemOpciones(aspirante)
    this.dataService.getItemOpciones(aspirante, 'legal').then((res) => {
      //console.log(res);
      this.mostrarOpciones(res['aspirante'], res['botones'])
    })

  }


  async mostrarOpciones(aspirante, botones) {

    let strTitulo = aspirante.asp_nombre || `${aspirante.asp_nombres} ${aspirante.asp_apellidop} ${aspirante.asp_apellidom}`

    botones.forEach(element => {

      const strFunct = element['handler'].toString();
      element['handler'] = () => eval(strFunct);

    });

    const opciones = await this.actionSheetCtr.create({
      header: strTitulo,
      cssClass: 'action-sheet-th',
      buttons: botones,
    });

    await opciones.present();

  }


  async mostrarModal() {
    const modal = await this.modalController.create({
      component: FormValidarLegalComponent,
      cssClass: 'my-modal-class',
      componentProps: {
        nombre: 'Fernando',
        pais: 'Costa Rica'
      }
    });

    await modal.present();

    // const { data } = await modal.onDidDismiss();
    const { data } = await modal.onWillDismiss();
    console.log('onWillDismiss');

    console.log(data);

  }


  mostrarHistorial() {
    this.showHistorial = (this.showHistorial) ? false : true;
    this.listarAspirantes(this.estado)
  }

}
