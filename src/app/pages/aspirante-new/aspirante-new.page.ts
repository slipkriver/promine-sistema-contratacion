import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AlertController, LoadingController, NavController, ModalController, IonFab } from '@ionic/angular';
import { ListCargosComponent } from 'src/app/componentes/list-cargos/list-cargos.component';
import { DataService } from 'src/app/services/data.service';

import { AspiranteInfo } from '../../interfaces/aspirante';

import { ThemePalette } from '@angular/material/core';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';
import { User } from '../../interfaces/user';
import { parse } from 'path';

@Component({
  selector: 'app-aspirante-new',
  templateUrl: './aspirante-new.page.html',
  styleUrls: ['./aspirante-new.page.scss'],
})
export class AspiranteNewPage implements OnInit {

  // @ViewChild('opcionesfoto', { read: ElementRef })
  @ViewChild('opcionesfoto', { static: false }) fabLista?: IonFab;

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  aspirante = <AspiranteInfo>{}
  aspirantecodigo = "nuevo"

  fechaEntrevista: Date = new Date();
  fechaIngreso: Date = new Date();
  //fechaModificado: Date = new Date(Date.now());
  fechaNacimiento: Date = new Date();

  conadis: boolean = true;
  experiencia: boolean = true;
  departamentos: any[] = [];
  paises: any[] = [];
  sexo: any[] = [];
  civil: any[] = [];
  tipo_sangre: any[] = [];
  cargo: any[] = [];
  referencia: any[] = [];
  academico: any[] = [];
  militar: any[] = [];
  etnia: any[] = [];
  religion: any[] = [];
  discapacidad: any[] = [];

  infogeneral: boolean = true;
  infoubicacion: boolean = true;
  mensajecedula: string = '';
  ci_valida: boolean = true;
  soloLectura: boolean = true

  listas = ['paises', 'sexo', 'civil', 'tipo_sangre', 'etnia', 'academico', 'religion', 'militar', "discapacidad"]

  mdFechaEntrevista = false
  mdFechaNacimiento = false

  displayformat = {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }

  guardando = false;
  hasUserInteracted = false;

  fotografia: any;
  asp_url_foto = 'assets/icon/no-person.png';

  user: User;

  salarioDecimalMaskOptions = {
    align: 'right',
    allowNegative: false,
    decimalSeparator: ',',
    precision: 3,
    prefix: '',
    suffix: '',
    thousandsSeparator: '',
    valueMode: 'standard',
  };

  constructor(
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private actRoute: ActivatedRoute,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private servicioFtp: FtpfilesService,
  ) {
    //this.adapter.setLocale('es');
  }


  ngOnInit() {

    //console.log(this.fechaNacimiento.toLocaleString(), this.fechaModificado.toISOString(), this.fechaEntrevista.toUTCString());
    // this.aspirante = this.dataService.aspirantes[0];
    this.listas.forEach(element => {

      this.dataService.getAspiranteLData(element).subscribe(lista => {
        this[element] = lista;
        //console.log(lista);
      });

    });

    this.dataService.geCargos().subscribe((lista: any[]) => {
      this.cargo = lista['cargos'];
      //console.log(this.cargo);
    });

    if (!this.hasUserInteracted) {
      this.aspirante.asp_pais = null;
    }

  }//2022-07-08T20:06:38



  ionViewWillEnter() {
    // this.guardando = false;
    setTimeout(() => {
      // console.log( this.fechaEntrevista.toISOString(),"**", this.aspirante.asp_ing_entrevista );

      this.dataService.mostrarLoading$.emit(true)
      // this.dataService.getEmpleadoLData('departamento').subscribe(departamentos => {
      //   this.departamentos = departamentos;
      // });

      //this.user = 

      this.actRoute.params.subscribe((data: any) => {
        // console.log(data);
        if (data['asp_cedula']) {
          //if (this.dataService.aspirante) {
          const objaspirante = this.dataService.aspirantes.find(function (item) {
            return item.asp_cedula === data['asp_cedula']
          });

          this.aspirante = JSON.parse(JSON.stringify(objaspirante))
          const evento = {
            target: { value: this.aspirante.asp_sueldo}
          }
          this.aspirante.asp_sueldo = this.formatMoneda(evento)
          // console.log(data['asp_cedula'], this.aspirante.asp_sueldo);

          //this.fechaNacimiento = new Date(this.aspirante.asp_fecha_nacimiento);
          this.fechaNacimiento = new Date(this.dataService.changeDateFormat(this.aspirante.asp_fecha_nacimiento));
          this.fechaIngreso = new Date(this.dataService.changeDateFormat(this.aspirante.asp_fch_ingreso));

          // console.log(this.aspirante.asp_ing_entrevista);
          if (!!this.aspirante.asp_ing_entrevista) {
            this.aspirante.asp_ing_entrevista = this.aspirante.asp_ing_entrevista.replace(" ", "T")
          } else {
            this.aspirante.asp_ing_entrevista = this.cambiarFormatoFecha(this.fechaEntrevista).replace(" ", "T")
          }

          this.asp_url_foto = this.aspirante.asp_url_foto.replace('..', 'http://getssoma.com') || this.asp_url_foto;
          // console.log(this.aspirante.asp_url_foto, this.asp_url_foto);

          this.aspirantecodigo = data.asp_codigo
        } else {
          const objaspirante = this.dataService.newObjAspirante()
          this.aspirante = JSON.parse(JSON.stringify(objaspirante))
          this.fechaIngreso = new Date()
          // this.fechaEntrevista = new Date()
          const fechaActual = new Date();
          this.fechaNacimiento = new Date("2011-01-01")
          this.aspirante.asp_ing_entrevista = this.cambiarFormatoFecha(fechaActual).replace(" ", "T")


        }

        this.dataService.mostrarLoading$.emit(false);

      }).unsubscribe()

    }, 3000);

    /*this.aspirante = { ...this.aspirante,
      asp_academico: "POSTGRADO",
      asp_apellidom: "ESCOBAR",
      asp_apellidop: "RIVERA",
      asp_aprobacion: false,
      asp_cargo: "ASISTENTE/AYUDANTE/AUXILIAR ADMINISTRATIVO",
      asp_cargo_area: "PLANTA",
      asp_cedula: "0000000000",
      asp_codigo: "0002225100",
      asp_conadis: "SI",
      asp_condicion: null,
      asp_correo: "AYUWOKI@GMAIL.COM",
      asp_direccion: "AV. AMAZONAS Y GALO ANSELMO",
      asp_discapacidad: "AUDITIVA",
      asp_ecivil: "CASADO/A",
      asp_edad: null,
      asp_estado: 0,
      asp_etnia: "COFAN",
      asp_evaluacion: null,
      asp_experiencia: null,
      asp_fch_ingreso: "2023-05-16 05:00:00",
      asp_fecha_nacimiento: "1987-06-08",
      asp_gpo_sanguineo: "O-",
      asp_hora_entrevista: null,
      asp_ing_entrevista: "2023-05-15T23:02:51",
      asp_lugar_nacimiento: "PIÑAS EL ORO",
      asp_militar: "SI",
      asp_nmb_experiencia: null,
      asp_nombres: "RODOLFO MAXIMILIAN",
      asp_nro_conadis: "12121244",
      asp_observacion_final: null,
      asp_observaciones: "SO",
      asp_pais: "ECUADOR",
      asp_porcentaje: "20",
      asp_recomendado: null,
      asp_referencia: "IND EDISON DE LA CRUZ",
      asp_religion: "MORMONA",
      asp_sexo: "MASCULINO",
      asp_sueldo: "700",
      asp_telefono: "0912345678",
      asp_titulo_nombre: "INGENIERA QUIMICA",

    }*/


  }


  ngAfterViewInit() {
    this.hasUserInteracted = true;
    // console.log(this.hasUserInteracted, this.aspirante.asp_pais)
  }

  ionViewWillLeave() {
    this.hasUserInteracted = false;
    // console.log(this.hasUserInteracted, this.aspirante.asp_pais)
  }

  getUserRole() {
    const role = (this.dataService?.userLogin) ? this.dataService.userLogin?.role : 'guess';
    //console.log(role);
    if (['tthh', 'admin', 'soci'].includes(role)) {
      return true;
    }
    else {
      return false;
    }
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1 === c2 : c1 === c2;
  }

  clearSelection() {
    // this.aspirante.asp_pais = null;
    this.hasUserInteracted = true;
  }

  cambiarFormatoFecha(fecha) {
    return this.dataService.changeDateFormat(fecha)
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
        cargo: { nombre: this.aspirante.asp_cargo || "", area: this.aspirante.asp_cargo_area || "" }
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data || data == undefined || data.role == "cancelar") {
      modal.dismiss()
      return;
    }
    // console.log(data)
    this.aspirante.asp_cargo_area = data.cargo.car_area;
    this.aspirante.asp_cargo = data.cargo.car_nombre;
    this.aspirante.asp_sueldo = data.cargo.car_salario;
    this.aspirante.asp_codigo = data.cargo.car_iess;
  }


  async onSubmitTemplate() {
    //this.dataService.updateAspiranteLocal(this.aspirante)
    console.log(this.aspirante, this.fechaIngreso);

    this.aspirante.asp_estado = 0;
    this.guardando = true;
    // const loading = await this.loadingCtrl.create({
    //   message: '<b>Guardando información... <b><br>Espere por favor',
    //   translucent: true,
    //   duration: 1000,
    // });
    //loading.present()

    this.aspirante.asp_fch_ingreso = this.fechaIngreso.toISOString().substring(0, 19).replace("T", " ");
    // this.aspirante.asp_ing_entrevista = this.aspirante.asp_ing_entrevista.replace("T", " ");
    this.aspirante.asp_fecha_nacimiento = this.fechaNacimiento.toISOString().substring(0, 10).trim();
    this.aspirante.atv_aspirante = this.aspirante.asp_cedula;
    this.aspirante.atv_fingreso = this.aspirante.asp_fch_ingreso;

    delete this.aspirante.asp_id;
    delete this.aspirante['asp_fecha_modificado'];

    const conexion = this.dataService.nuevoAspirante(this.aspirante).subscribe(async res => {


      this.aspirante['asp_nombre'] = `${this.aspirante.asp_nombres} ${this.aspirante.asp_apellidop} ${this.aspirante.asp_apellidom}`.toUpperCase()

      if (res['success'] == false) {
        this.mostrarAlerduplicado(this.aspirante)
      }
      else {
        if (!!this.fotografia) {
          this.subirFotografia()
        }
        this.aspirantecodigo = res['aspirante'].asp_id;
        //this.dataService.updateAspiranteLocal(this.aspirante, true)
        this.dataService.updateAspiranteLocal(res['aspirante'], true);
        this.guardando = false;
        this.mostrarAlerOk(this.aspirante, true)
        //this.mostrarAlerOk(this.aspirante)
      }

    })
    setTimeout(() => {
      if (this.guardando == true) {
        this.dataService.presentAlert("Error de conexion", "<ion-icon name='cloud-offline' ></ion-icon> <ion-label>Se prese/nto un problema de comunicacion con el servidor.</ion-label>", "alertError");
        this.guardando = false;
        conexion.unsubscribe();
      }
    }, 10000);

  }


  async onSubmitUpdate() {
    this.guardando = true;
    // console.log(this.fechaIngreso.toISOString(), this.aspirante.asp_ing_entrevista);
    this.aspirante.asp_fch_ingreso = this.fechaIngreso.toISOString().substring(0, 19).replace('T', ' ');
    this.aspirante.asp_ing_entrevista = this.aspirante.asp_ing_entrevista.replace('T', ' ');
    this.aspirante.asp_fecha_nacimiento = this.fechaNacimiento.toISOString().substring(0, 10).trim()

    this.aspirante.atv_aspirante = this.aspirante.asp_cedula
    this.aspirante['asp_nombre'] = `${this.aspirante.asp_nombres} ${this.aspirante.asp_apellidop} ${this.aspirante.asp_apellidom}`.toUpperCase()
    //console.log(this.aspirante['asp_nombre'])

    const conexion = this.dataService.updateAspirante(this.aspirante).subscribe(async res => {

      if (!!this.aspirante.asp_url_foto) {
        this.subirFotografia();
      }

      if (res['aspirante']) {
        this.dataService.updateAspiranteLocal(res['aspirante'])
        this.mostrarAlerOk(this.aspirante)
      } else {
        console.log("NO Aspirante", res['aspirante'])
      }

      //console.log(res['aspirante'])
      this.guardando = false;
    });

    setTimeout(() => {

      if (this.guardando == true) {
        this.dataService.presentAlert("Error de conexion", "<ion-icon name='cloud-offline' ></ion-icon> <ion-label>Se presento un problema de comunicacion con el servidor.</ion-label>", "alertError");
        this.guardando = false;
        conexion.unsubscribe();
      }

    }, 10000);
    // })

  }


  subirFotografia() {
    let formData = new FormData();

    if ((this.fotografia?.size / 1048576) <= 4) {
      //let task =  'subirfichapsico'
      formData.append('file', this.fotografia, this.fotografia.name);
      formData.append('aspirante', this.aspirante.asp_cedula)
      formData.append('ext', this.fotografia.name.split('.')[1]);
      formData.append('task', "subirfotografia");
      // this['existe' + strFile] = true;
      this.servicioFtp.uploadFile(formData).subscribe(res => {
        // console.log('Archivo', res, `**${this.fotografia.name.split('.')[1]}**`);
      });

    }
  }

  actualizarvalor(evento, variable) {
    // console.log(evento, ' -> ', variable)
    if (evento.checked == false) {
      this.aspirante[variable] = 'NO'
      this[variable] = false
    }
    else {
      this.aspirante[variable] = 'SI'
      this[variable] = true
    }
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


  cambioFecha(event) {

    console.log(event);
    console.log(new Date(event.detail.value));

  }

  setFoto(event) {

    if (event.target.files[0]) {
      this.fabLista?.close();
      this.fotografia = event.target.files[0];
      this.asp_url_foto = URL.createObjectURL(event.target.files[0]);
      this.aspirante.asp_url_foto = "../tthh/fotos/fotografia-" + this.aspirante.asp_cedula + "." + this.fotografia.name.split('.')[1];
      //this.aspirante.asp_url_foto = event.target.value;
    }
    // console.log(this.aspirante.asp_url_foto);
  }

  quitarFoto() {
    this.aspirante.asp_url_foto = "";
    this.fotografia = "";
    this.asp_url_foto = "assets/icon/no-person.png";
  }


  cambiarMayusculas(e, campo) {
    const ss = e.target.selectionStart;
    const se = e.target.selectionEnd;
    e.target.value = e.target.value.toUpperCase();
    this.aspirante[campo] = e.target.value.toUpperCase();
    e.target.selectionStart = ss;
    e.target.selectionEnd = se;
  }


  formatMoneda(evento): string {
    // Formatear el valor numérico con 2 decimales
    // console.log(this.aspirante.asp_sueldo, evento.target.value)
    //parse(value)
    // const floatValue:number = evento.target.value;
    const floatValue = parseFloat(evento.target.value).toFixed(2)
    this.aspirante.asp_sueldo = floatValue

    // console.log(this.aspirante.asp_sueldo, "$$$ ",floatValue);
    return floatValue ? floatValue:'';
  }

}

