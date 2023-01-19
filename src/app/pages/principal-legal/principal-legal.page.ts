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

  aspirantesBuscar = []

  estados = []
  estado

  listaTareas = []
  numNotificaciones = 0;

  aspirantesNuevo = []
  contPagina = 0;
  numPaginas = 1;
  loadingData = false;

  constructor(
    private actionSheetCtr: ActionSheetController,
    private modalController: ModalController,
    private dataService: DataService,
    private router: Router,
  ) { }

  ngOnInit() {

    this.dataService.aspOpciones$.subscribe(item => {
      if (item.departamento == 'legal')
        // this.opcionesTarea(item);
        console.log('cualquier cosa');
    })
  }

  ionViewDidEnter() {

    // this.dataService.setSubmenu('Departamento Legal');

    // this.listarAspirantes({ detail: { value: 0 } })
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

  listarAspirantes(event?) {

    if(this.loadingData) return;

    // this.dataService.mostrarLoading( )

    this.listaTareas = [];
    this.contPagina = 0;
    this.loadingData = true;

    const id = (event) ? event.detail.value : 0
    this.estado = id

    let est_color = "#2fdf75";

    if (id == 0) {
      this.numNotificaciones = this.listaTareas.length
    }else if (id == 1){
      est_color = "#3171e0"
    }


    this.dataService.listadoPorDepartamento('legal', id).then(res => {
      //console.log(res, id)
      this.numPaginas = Math.round(res['aspirantes'].length / 4) || 1;
      if(res['aspirantes'].length){
        
        res['aspirantes'].forEach(element => {
          
          element = {... element, est_color}
          this.listaTareas.push(element)  
          
        });
        
        this.aspirantesNuevo = this.listaTareas.slice(0, 4);
      }

      this.loadingData = false;
      this.dataService.cerrarLoading()
    })

  }

  updatePagina(value) {
    this.contPagina = this.contPagina + value;
    //console.log(this.contPagina*4,(this.contPagina+1)*4)
    this.aspirantesNuevo = this.listaTareas.slice(this.contPagina * 4, (this.contPagina + 1) * 4);
  }

  opcionesTarea(aspirante){
    console.log(aspirante);
  }

  setEstado(evento) {
    // console.log(evento)
    //this.estado = evento.detail.value
    this.listarAspirantes(evento)
  }

  showOpciones(item) {
    //console.log(item);
    this.opcionesTarea(item);
  }
}
