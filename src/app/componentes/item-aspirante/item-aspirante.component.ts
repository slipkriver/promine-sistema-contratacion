import { Component, Input, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

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

  loading: boolean = true;

  button_label = "Opciones";
  constructor(

    private dataService: DataService,
    private alertController: AlertController

   ) { 

    addIcons({
      'banner-item': 'assets/icon/banner-item.svg',
      'banner-item-outline': 'assets/icon/banner-item-outline.svg',
      //'flag-de': 'assets/flags/de.svg'
    });

  }

  ngOnInit() {}

  getUrlFoto(){
    if(this.aspirante.asp_url_foto){
      return this.aspirante.asp_url_foto.replace('..','https://getssoma.com');
    }else{
      if(this.aspirante.asp_sexo == 'MASCULINO'){
        return 'assets/icon/personm.png'
      }else{
        return 'assets/icon/personf.png'
      }
    }
  }

  endLoading(){
      //console.log("Img** loaded!!")
      setTimeout(() => {
        this.loading = false;
      }, 500);
  }

  setButtonLabel(text){
    //console.log(text)
    this.button_label = text;
  }

  abrirMenu(){
    this.dataService.aspItemOpts$.emit(this.aspirante)
  }

  async presentAlert(title, content) {
    const alert = await this.alertController.create({
      header: title,
      //subHeader: 'Subtitle',
      message: content,
      buttons: ['Cerrar']
    });
  
    await alert.present();
  }
}
