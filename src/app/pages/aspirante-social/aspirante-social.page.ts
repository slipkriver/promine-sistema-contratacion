import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { AspiranteInfo } from '../../interfaces/aspirante';
import { AspiranteSoci, AspiranteFamiliar, AspiranteCarga } from '../../interfaces/aspirante-soci';
import { EmpleadoInfo } from 'src/app/interfaces/empleado';

import { LoadingController, NavController, IonContent, IonSlides, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aspirante-social',
  templateUrl: './aspirante-social.page.html',
  styleUrls: ['./aspirante-social.page.scss'],
})
export class AspiranteSocialPage implements OnInit {

  // @Input("aspirante") aspirante;

  @ViewChild(IonContent) content: IonContent | undefined;
  @ViewChild(IonSlides) slides: IonSlides | undefined;

  aspirante:any = <AspiranteInfo>{}
  empleado = <EmpleadoInfo>{}
  aspirante_social:any = new AspiranteSoci()

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
  religion: any[] = [];
  discapacidad: any[] = [];
  vivienda: any[] = [];
  construccion: any[] = [];
  banco: any[] = [];
  transporte: any[] = [];
  parentezco: any[] = [];
  parentezco_filter: any[] = [];

  infoubicacion: boolean = false;
  infofamiliares: boolean = false;
  infovivienda: boolean = false;
  infoeconomica: boolean = false;
  x
  mensajecedula: string = '';

  tooltipubicacion: string = 'Informacion relacionada con los familiares de trabajador, a los cuales se contacta en caso de que se necesite comunicar alguna novedad.';
  tooltipvivienda: string = 'Informacion sobre la vivienda del trabajador, servicios basicos a los que tiene acceso y como se moviliza hasta el lugar de trabajo.';
  tooltipeconomica: string = 'Detalle de los ingresos y gastos totales que se generan en el hogar del trabajador.';
  tooltipfamiliares = '<mat-icon matSuffix>key</mat-icon> Detos informativos de las cargas familiares que dependen del trabajador.';

  ci_valida: boolean = true;
  soloLectura: boolean = true

  guardando = false;

  listas = ['estado', 'paises', 'sexo', 'civil', 'tipo_sangre', 'cargo', 'referencia', 'academico', 'etnia', 'vivienda', 'construccion', 'banco', 'transporte', 'parentezco']


  slideOpts = {
    initialSlide: 0,
    slidesPerView: 1,
    allowTouchMove: false
  };

  pageIndex = 0;
  selectSlide = 0;

  loading: boolean = true;
  familiar = new AspiranteFamiliar();
  responsable = new AspiranteFamiliar();
  cargas: AspiranteCarga[] = [];

  //objPage:any = {};

  constructor(
    private dataService: DataService,
    //private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private actRoute: ActivatedRoute,
    public alertCtrl: AlertController,
  ) { }

  ngOnInit() {

    //this.objPage = this;
    this.listas.forEach(element => {

      this.dataService.getAspiranteLData(element).subscribe((lista:any) => {
        this[element] = lista;
        //console.log(this.estado);
      });

    });

  }


  ionViewWillEnter() {

    //let objPage:any = this;
    this.dataService.mostrarLoading$.emit(true)

    this.actRoute.params.subscribe((data: any) => {
      //if (this.dataService.aspirante) {
      //const objaspirante = this.dataService.aspirantes.find(function (item) {
      const objaspirante = this.dataService.aspirantes.find(function (item) {
        return item.asp_cedula === data['asp_cedula']
      });

      
      
      //objaspirante.asp_nombres = `${objaspirante.asp_apellidop} ${objaspirante.asp_apellidom} ${objaspirante.asp_nombres}`
      this.aspirante = JSON.parse(JSON.stringify(objaspirante))
      // console.log(this.aspirante, this.aspirante_social);
      //this.aspirante = JSON.parse(JSON.stringify(nAspirante));
      if (!!this.aspirante['aov_familiar']) {
        this.familiar = JSON.parse(this.aspirante['aov_familiar'])
      }

      if (!!this.aspirante['aov_responsable']) {
        this.responsable = JSON.parse(this.aspirante['aov_responsable'])
      }
      
      if (!!this.aspirante['aov_familiares']) {
        this.cargas = JSON.parse(this.aspirante['aov_familiares'])
      }


      Object.keys(this.aspirante_social).map(key => {
        //console.log(key)  
        if (!!this.aspirante[key])
          this.aspirante_social[key] = this.aspirante[key];
        //return { text: key, value: key }
      });

      this.parentezco_filter = this.parentezco;

      // console.log(this.aspirante_social.aov_ingresos)
      this.fechaNacimiento = new Date(this.dataService.changeDateFormat(this.aspirante.asp_fecha_nacimiento));
      this.fechaIngreso = new Date(this.dataService.changeDateFormat(this.aspirante.asp_fch_ingreso));


      // this.aspirantecodigo = data.asp_codigo
      this.aspirante = JSON.parse(JSON.stringify(objaspirante))
      //console.log(this.aspirante_social);
      this.fechaIngreso = new Date()
      // this.fechaEntrevista = new Date()
      const fechaActual = new Date();
      this.fechaNacimiento = new Date("2011-01-01")


      this.dataService.mostrarLoading$.emit(false);

    }).unsubscribe()

  }

  mostrarContenido(contenido) {

    this[contenido] = (this[contenido]) ? false : true

  }

  cambioFecha(event:any) {

    // console.log(event);
    // console.log(new Date(event.detail.value));

  }


  async onSubmitTemplate() {
    this.dataService.mostrarLoading()

    //let objAspirante = new AspiranteSoci()
    //type objAspirante = typeof AspiranteSoci;
    /*Object.keys(this.aspirante_social).map(key => {
      //console.log(key)  
      if(!!this.aspirante[key])
        this.aspirante_social[key] = this.aspirante[key];
      //return { text: key, value: key }
    });*/

    this.aspirante_social['aov_aspirante'] = this.aspirante.asp_cedula;
    this.aspirante_social['asp_estado'] = 12;
    this.aspirante_social['aov_familiar'] = JSON.stringify(this.familiar);
    this.aspirante_social['aov_responsable'] = JSON.stringify(this.responsable);
    this.aspirante_social['aov_familiares'] = JSON.stringify(this.cargas);

    const newAspirante:any = []
    Object.entries(this.aspirante_social).forEach(([key, value]) => {
      // 👇️ name Tom 0, country Chile 1
      if (!!value) {
        newAspirante[key] = value
        // console.log(objLegal[key], value, key);
      }
    });

    console.log(this.aspirante, this.aspirante_social, newAspirante)

    // return;

    /*if (!!this.familiar) {
      console.log(this.familiar)
    } else{
      console.log("NO familiar... ", this.familiar)
    }*/

    this.dataService.verifySocial(this.aspirante_social).subscribe((res:any) => {
      console.log(res)
      if(res['success']===true){
        this.mostrarAlerOk(this.aspirante, true)

      }
    })
    //console.log('INGRESO', objAspirante)

  }


  actualizarvalor(evento:any, variable:string) {
    // console.log(evento);
    if (evento.checked == false) {
      this.aspirante_social[variable] = 'NO'
      this[variable] = false
    }
    else {
      this.aspirante_social[variable] = 'SI'
      this[variable] = true
    }
    //console.log(this.productor[variable], ' -> ', variable)
  }



  activarFormulario() {
    if (!this.soloLectura) {
      return
    }
    this.soloLectura = (this.soloLectura) ? false : true
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

  
  cancelarSolicitud() {
    this.navCtrl.navigateBack(['/inicio/tab-aspirante/principal-social']);

  }


  slidePrev() {
    this.slides?.slidePrev();
  }

  slideNext() {
    this.slides?.slideNext();
  }

  setSlide(index:number) {
    setTimeout(() => {
      
      this.slides?.slideTo(index, 1000);
      this.selectSlide = index;
      // console.log(index);
    }, 200);
    
    //this.content.scrollToTop();
  }

  updatePageIndex() {
    this.slides?.getActiveIndex().then((index) => {
      this.pageIndex = index;
    });
  }

  borrarCarga(index:number) {
    
    //setTimeout(() => {
      this.cargas.splice(index, 1);

      if(index==this.cargas.length){
        this.setSlide(this.cargas.length-1)
      }

    //}, 200);

  }


  setValorDecimal(event:any) {
    event.target.value = parseFloat(event.target.value).toFixed(2)
  }

  nuevaCarga( evento:Event ) {
    evento.stopPropagation()
    if (this.cargas.length < 6) {
      this.cargas.push(new AspiranteCarga());
      this.setSlide(this.cargas.length-1);
    }
  }

  getEdad(fecha:any) {
    //convert date again to type Date
    if (!fecha) return '';

    const bdate = new Date(fecha);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    return `${Math.floor((timeDiff / (1000 * 3600 * 24)) / 365)} años `;
    //console.log(this.asp_edad)
  }


  async mostrarAlerOk(aspirante:any, nuevo?:boolean) {
    const textoHeader = (nuevo) ? "ingresado" : "actualizado";
    const textoMensaje = (nuevo) ? "ingresada al " : "actualizada en el ";
    const alert = await this.alertCtrl.create({
      header: `Aspirante ${textoHeader} exitosamente`,

      //subHeader: 'El aspirante ya se escuentra ingresado en el sistema',
      message: `<p>La informacion del aspirante ha sido ${textoMensaje} sistema con exito.</p>` +
        "<ion-item> <ion-icon name='information-circle' size='large' slot='start'> </ion-icon> " +
        "<ion-label>Cedula: <b>" + aspirante["asp_cedula"] + "<br>" + aspirante["asp_nombre"] + "</b>" +
        "</ion-label></ion-item>" +
        "<div style='display: flex;''><ion-icon name='information-circle'></ion-icon>" +
        "<ion-label >" +
        "<i>Presiona Aceptar para regresar a la pagina principal.</i></ion-label></div>",
      cssClass: 'alertDuplicado alertOk',
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'btnAlertDplicado',
          role: 'ok',
          handler: () => {
            this.cancelarSolicitud();
          }
        },
        {
          text: 'Cancelar',
          cssClass: '',
          role: 'cancel'
        }
      ]
    });
    await alert.present()
  }


}
