import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, LoadingController, NavController, ModalController } from '@ionic/angular';
import { ListCargosComponent } from 'src/app/componentes/list-cargos/list-cargos.component';
import { DataService } from 'src/app/services/data.service';

import { AspiranteInfo } from '../../interfaces/aspirante';
import { EmpleadoInfo } from '../../interfaces/empleado';

import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-aspirante-new',
  templateUrl: './aspirante-new.page.html',
  styleUrls: ['./aspirante-new.page.scss'],
})
export class AspiranteNewPage implements OnInit {

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  aspirante = <AspiranteInfo>{}
  empleado = <EmpleadoInfo>{}
  aspirantecodigo = "nuevo"

  fechaEntrevista: Date = new Date();
  fechaIngreso: Date = new Date();
  //fechaModificado: Date = new Date(Date.now());
  fechaNacimiento: Date = new Date();

  conadis: boolean = true;
  experiencia: boolean = true;
  estado: any[] = [];
  departamentos: any[] = [];
  paises: any[] = [];
  sexo: any[] = [];
  civil: any[] = [];
  tipo_sangre: any[] = [];
  cargo: any[] = [];
  referencia: any[] = [];
  academico: any[] = [];
  militar: any[] = [];

  infogeneral: boolean = true;
  infoubicacion: boolean = true;
  mensajecedula: string = '';
  ci_valida: boolean = true;
  soloLectura: boolean = true

  listas = ['estado', 'paises', 'sexo', 'civil', 'tipo_sangre', 'cargo', 'referencia', 'academico', 'militar']

  mdFechaEntrevista = false
  mdFechaNacimiento = false

  displayformat = {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }

  guardando = false;

  constructor(
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private actRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController
  ) {
    //this.adapter.setLocale('es');
  }

  ngOnInit() {

    //console.log(this.fechaNacimiento.toLocaleString(), this.fechaModificado.toISOString(), this.fechaEntrevista.toUTCString());

    this.dataService.mostrarLoading();

    this.listas.forEach(element => {

      this.dataService.getAspiranteLData(element).subscribe(lista => {
        this[element] = lista;
        //console.log(this.estado);
      });

    });

    //this.aspirante = this.dataService.nuevoAspirante()
    //console.log(this.fechaNacimiento.toLocaleString(), this.fechaNacimiento.toLocaleDateString())

    // this.getAspirante('0915916753');
    // setTimeout(() => {
    //   this.aspirante.asp_id = undefined;
    //   this.aspirante['asp_fecha_modificado'] = '';
    //   console.log(this.aspirante);
    // }, 2000);

    // return;

    this.dataService.getEmpleadoLData('departamento').subscribe(departamentos => {
      this.departamentos = departamentos;
    });

    this.actRoute.params.subscribe((data: any) => {
      if (data['asp_cedula']) {
        if (this.dataService.aspirante) {
          this.aspirante = this.dataService.aspirante
        } else {
          setTimeout(() => {
            this.getAspirante(data['asp_cedula']);
          }, 1000);
        }
        this.aspirantecodigo = data.asp_codigo
      } else {
        this.aspirante = <AspiranteInfo>{}
        this.aspirante = this.dataService.newObjAspirante(this.aspirante)

      }

    })


  }//2022-07-08T20:06:38

  ionViewWillEnter() {
    setTimeout(() => {
      this.dataService.mostrarLoading$.emit(false);
      // console.log( this.aspirante.asp_fecha_nacimiento, this.fechaNacimiento)
    }, 1000);
  }

  getAspirante(cedula) {
    this.dataService.dataLocal.getAspirante(cedula).then((res: AspiranteInfo) => {
      this.fechaNacimiento = new Date(res['asp_fecha_nacimiento'] + " 00:00:00")//.format(new Date(res['asp_fecha_nacimiento']),'YYYY-MM-DD');
      //console.log(res['asp_fecha_nacimiento'], this.fechaNacimiento)
      this.aspirante = res;
      this.dataService.cerrarLoading();
    })
  }

  async mostrarAlerduplicado(aspirante) {
    const alert = await this.alertCtrl.create({
      header: 'Error de ingreso',

      //subHeader: 'El aspirante ya se escuentra ingresado en el sistema',
      message: "<p>El aspirante ya se escuentra ingresado en el sistema. O la informacion necesaria no esta bien ingresada.</p>" +
        "<ion-item> <ion-icon name='warning' size='large' slot='start'>" +
        "</ion-icon> <ion-label>Cedula: <b>" + aspirante["asp_cedula"] + "<br>" + aspirante["asp_nombre"] + "</b>" +
        "</ion-label></ion-item>" +
        "<div style='display: flex;''><ion-icon name='information-circle'></ion-icon>" +
        "<ion-label >" +
        "<i>Revisa los campos ingresados y vuelve a intentar.</i></ion-label></div>",
      cssClass: 'alertDuplicado',
      buttons: [
        {
          text: '< Regresar',
          cssClass: 'btnAlertDplicado'
        }
      ]
    });
    await alert.present()
  }

  mostrarContenido(contenido) {

    this[contenido] = (this[contenido]) ? false : true

  }


  async mostrarAlerOk(aspirante, nuevo?) {
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


  abrirFechaEsntrevista() {
    if (this.mdFechaEntrevista == true) {
      this.mdFechaEntrevista = false
    } else {
      this.mdFechaEntrevista = true
    }
  }

  abrirModalfecha(variable) {
    //console.log(variable,this[variable])
    if (this[variable] == true) {
      this[variable] = false
    } else {
      this[variable] = true
    }
  }


  async modalCargos() {
    const modal = await this.modalCtrl.create({
      component: ListCargosComponent,
      componentProps: {
        class: "my-modal-class",
        cargos: this.cargo,
        cargo: this.aspirante.asp_cargo
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data || data == undefined || data.role == "cancelar") {
      modal.dismiss()
      return;
    }
    //console.log(data)
    this.aspirante.asp_cargo = data.cargo;
  }

  async onSubmitTemplate() {
    const fechaActual:Date = new Date();
    //this.dataService.updateAspiranteLocal(this.aspirante)

    this.aspirante.asp_estado = 'INGRESADO'
    this.guardando = true;
    const loading = await this.loadingCtrl.create({
      message: '<b>Guardando información... <b><br>Espere por favor',
      translucent: true,
      duration: 1000,
    });
    //loading.present()

    console.log(JSON.stringify(this.aspirante),this.aspirante.asp_id); return;
    this.aspirante.asp_fch_ingreso = this.fechaEntrevista.toISOString().substring(0, 19).replace('T', ' ');
    this.aspirante.asp_fecha_nacimiento = this.fechaNacimiento.toISOString().substring(0, 10);
    this.aspirante.atv_aspirante = this.aspirante.asp_cedula;
    this.aspirante.atv_fingreso = this.aspirante.asp_fch_ingreso;
    // const nfecha = this.dataService.dataLocal.changeFormat(fechaActual);
    // this.aspirante['asp_fecha_modificado'] = nfecha.toString();
    
    this.dataService.nuevoAspirante(this.aspirante).subscribe(res => {
    
      //const nAspirante = {... this.aspirante, asp_fecha_modificado:nfecha.toString()}
      console.log(this.aspirante);

      this.aspirante['asp_nombre'] = `${this.aspirante.asp_nombres} ${this.aspirante.asp_apellidop} ${this.aspirante.asp_apellidom}`.toUpperCase()
      console.log(res, 'aspirante-new')
      if (res['aspirante']) {
        this.mostrarAlerduplicado(this.aspirante)
      }
      else {
        if (!!res['asp_id']) this.aspirante.asp_id = res['asp_id'];
        this.aspirantecodigo = this.aspirante.asp_id;
        //this.dataService.updateAspiranteLocal(this.aspirante, true)
        this.mostrarAlerOk(this.aspirante, true)
      }

      setTimeout(() => {
        this.guardando = false;
      }, 1000);
    })


  }

  async onSubmitUpdate() {
    this.guardando = true;
    const loading = await this.loadingCtrl.create({
      message: '<b>Guardando información... <b><br>Espere por favor',
      translucent: true,
      duration: 2000,
    });
    //loading.present()
    //console.log(this.aspirante,this.aspirante.asp_id); return;

    this.aspirante.asp_fecha_nacimiento = this.fechaNacimiento.toISOString().substring(0, 10).trim()

    this.aspirante.atv_aspirante = this.aspirante.asp_cedula
    this.aspirante['asp_nombre'] = `${this.aspirante.asp_nombres} ${this.aspirante.asp_apellidop} ${this.aspirante.asp_apellidom}`.toUpperCase()
    //console.log(this.aspirante['asp_nombre'])

    this.dataService.updateAspirante(this.aspirante).subscribe(res => {
      if (res['success'] == true)
        //this.dataService.updateAspiranteLocal(this.aspirante)
      setTimeout(() => {
        this.guardando = false;
        //console.log(this.aspirante)
        this.mostrarAlerOk(this.aspirante)
      }, 1000);
    })


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
    // this.navCtrl.navigateBack(['/principal-th']);
    this.navCtrl.navigateBack(['/inicio/tab-aspirante/principal-th']);

  }


}

