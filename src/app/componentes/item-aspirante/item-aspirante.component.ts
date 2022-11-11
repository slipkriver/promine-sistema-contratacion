import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-item-aspirante',
  templateUrl: './item-aspirante.component.html',
  styleUrls: ['./item-aspirante.component.scss'],
})
export class ItemAspiranteComponent implements OnInit {


  @Input("aspirante") aspirante;
  @Input("index") index;
  @Output() clicOpciones = new EventEmitter();

  loading: boolean = true;

  button_label = "Opciones";


  constructor(
    private router: Router,
    private dataService: DataService,

  ) {

    addIcons({
      'banner-item': 'assets/icon/banner-item.svg',
      'banner-item-outline': 'assets/icon/banner-item-outline.svg',
      //'flag-de': 'assets/flags/de.svg'
    });

  }

  ngOnInit() { }


  ionViewWillLeave() {
    console.log("# COMPLETE EMIT!!!")
    //this.dataService.aspItemOpts$.unsubscribe();
  }

  getUrlFoto() {
    if (this.aspirante.asp_url_foto) {
      return this.aspirante.asp_url_foto.replace('..', 'https://getssoma.com');
    } else {
      if (this.aspirante.asp_sexo == 'MASCULINO') {
        return 'assets/icon/personm.png'
      } else {
        return 'assets/icon/personf.png'
      }
    }
  }

  endLoading() {
    //console.log("Img** loaded!!")
    setTimeout(() => {
      this.loading = false;
    }, 500);
  }

  setButtonLabel(text) {
    //console.log(text)
    this.button_label = text;
  }

  abrirMenu() {
    this.clicOpciones.emit(this.aspirante);
  }

  setSlide(slide, index) {
    slide.slideTo(index)
  }

  fichaAspirante() {
    this.dataService.aspirante = this.aspirante;
    this.router.navigate(['/inicio/tab-aspirante/aspirante-new/' + this.aspirante['asp_cedula']])
  }


}
