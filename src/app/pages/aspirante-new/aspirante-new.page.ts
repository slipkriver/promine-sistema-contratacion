import { Component, ViewChild } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController, IonFab, NavController } from '@ionic/angular';
import { ListCargosComponent } from 'src/app/componentes/list-cargos/list-cargos.component';
import { DataService } from 'src/app/services/data.service';

import { AspiranteInfo } from 'src/app/interfaces/aspirante';

import { ThemePalette } from '@angular/material/core';
import { FtpfilesService } from 'src/app/services/ftpfiles.service';
import { User } from 'src/app/interfaces/user';
//import { User } from '../../interfaces/user';
// import { EMPTY, Observable } from 'rxjs';
//import { parse } from 'path';
import { FormApiPersonaComponent } from '../../componentes/form-api-persona/form-api-persona.component';

@Component({
  selector: 'app-aspirante-new',
  templateUrl: './aspirante-new.page.html',
  styleUrls: ['./aspirante-new.page.scss'],
})

export class AspiranteNewPage {

  // @ViewChild('opcionesfoto', { read: ElementRef })
  @ViewChild('opcionesfoto', { static: false }) fabLista?: IonFab;

  color: ThemePalette = 'accent';
  checked = false;
  disabled = false;

  aspirante = <AspiranteInfo>{}
  aspirantecodigo = "nuevo"

  fechaEntrevista: any = new Date().toISOString();
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

  parentezco: any[] = [];
  parentesco_filter: any[] = [];

  infogeneral: boolean = true;
  infoubicacion: boolean = true;
  mensajecedula: string = '';
  ci_valida: boolean = true;
  soloLectura: boolean = true

  listas = ['paises', 'sexo', 'civil', 'tipo_sangre', 'etnia', 'academico', 'religion', 'militar', "discapacidad", "parentezco"]

  mdFechaEntrevista = false
  mdFechaNacimiento = false

  displayformat = {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }

  guardando = false;
  hasUserInteracted = false;

  fotografia: any;
  asp_url_foto = 'assets/icon/no-person.png';

  user: User = {
    uid: '',
    email: '',
    session: '',
    lastlogin: new Date('01-01-2023'),
    displayname: '',
    role: '',
    iplogin: '',
    photo: '',
    password: ''
  };
  activarCambios = false;

  isModalOpen: boolean = false;
  infoData: any;


  constructor(
    private dataService: DataService,
    private nacCtrl: NavController,
    private actRoute: ActivatedRoute,
    public alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private servicioFtp: FtpfilesService
  ) {
    //this.adapter.setLocale('es');
    this.dataService.userLogin$.subscribe(usuario => {
      // if(JSON.stringify(this.user) != JSON.stringify(usuario)){
      // console.log(JSON.stringify(this.user), JSON.stringify(usuario));
      //if(this.user !== usuario){
      this.user = JSON.parse(JSON.stringify(usuario));
      this.setInitData()
      // }
    })
    this.dataService.getUserLogin();
  }


  ngOnInit() {

    this.dataService.mostrarLoading$.emit(true)

    // console.log("ngOnInit() -->> ",this.fechaNacimiento.toLocaleString(), this.fechaEntrevista);
    // this.aspirante = this.dataService.aspirantes[0];
    //const objPage:any = this;

    this.listas.forEach((element: any) => {

      this.dataService.getAspiranteLData(element).subscribe((lista) => {
        this[element] = lista
        //console.log(lista);
      })

    });

    this.dataService.geCargos().subscribe((listado) => {
      this.cargo = listado['cargos'];
      //console.log(this.cargo);
    })

    if (!this.hasUserInteracted) {
      this.aspirante.asp_pais = '';
    }


    // this.navCtrl.navigateRoot(['/aspirante-new/'+this.aspirante.asp_cedula]);
    // this.router.navigate(['/detail']);
    //this.router.navigate(['/aspirante-new/'+this.aspirante.asp_cedula]);

  }


  setInitData() {
    // this.guardando = false;
    // console.log("SetInitData() >>> ",this.user, this.dataService.aspirantes.length);

    // this.user = this.dataService.userLogin;
    this.activarCambios = ['tthh', 'admin', 'soci'].includes(this.user.role)

    // console.log( this.fechaEntrevista.toISOString(),"**", this.aspirante.asp_ing_entrevista );

    // this.dataService.getEmpleadoLData('departamento').subscribe(departamentos => {
    //   this.departamentos = departamentos;
    // });

    //const role = (this.dataService?.userLogin) ? this.dataService.userLogin?.role : 'guess';

    this.actRoute.params.subscribe((data: any) => {
      if (!!data['asp_cedula']) {
        //if (this.dataService.aspirante) {
        const objaspirante = this.dataService.aspirantes.find(function (item) {
          return item.asp_cedula === data['asp_cedula']
        });

        // console.log(this.user, data, objaspirante);
        this.aspirante = JSON.parse(JSON.stringify(objaspirante))
        const evento = {
          target: { value: this.aspirante.asp_sueldo }
        }
        this.aspirante.asp_sueldo = this.formatMoneda(evento)
        // console.log(data['asp_cedula'], this.aspirante.asp_sueldo);
        //this.fechaNacimiento = new Date(this.aspirante.asp_fecha_nacimiento);
        this.fechaNacimiento = new Date(this.dataService.changeDateFormat(this.aspirante.asp_fecha_nacimiento));
        this.fechaIngreso = new Date(this.dataService.changeDateFormat(this.aspirante.asp_fch_ingreso));

        // console.log(this.aspirante.asp_ing_entrevista," >>> ");
        if (!!this.aspirante.asp_ing_entrevista) {
          // this.aspirante.asp_ing_entrevista = this.aspirante.asp_ing_entrevista.replace(" ", "T")
          this.fechaEntrevista = this.aspirante.asp_ing_entrevista.replace(" ", "T");
        } else {
          this.aspirante.asp_ing_entrevista = this.cambiarFormatoFecha(this.fechaEntrevista.toString()).replace(" ", "T")
        }
        // console.log(this.fechaEntrevista, this.aspirante.asp_ing_entrevista);

        this.asp_url_foto = this.aspirante.asp_url_foto.replace('..', 'http://promine-ec.com') || this.asp_url_foto;

        this.aspirantecodigo = data.asp_codigo
      } else {
        const objaspirante = this.dataService.newObjAspirante()
        this.aspirante = JSON.parse(JSON.stringify(objaspirante))
        this.fechaIngreso = new Date()
        // this.fechaEntrevista = new Date()
        const fechaActual = new Date();
        this.fechaNacimiento = new Date("2011-01-01")
        this.aspirante.asp_ing_entrevista = this.cambiarFormatoFecha(fechaActual.toString()).replace(" ", "T")

      }


    }).unsubscribe()

    setTimeout(() => {

      this.dataService.mostrarLoading$.emit(false);

    }, 2000);

  }


  ionViewDidEnter() {
    this.hasUserInteracted = true;
    this.parentesco_filter = this.parentezco;

    // console.log(this.hasUserInteracted, this.parentezco)
  }

  ionViewWillLeave() {
    this.hasUserInteracted = false;
    // this.dataService.aspirantes$.closed = true;
    // console.log(this.hasUserInteracted, this.aspirante.asp_pais)
  }

  getUserRole() {
    const role = (this.user) ? this.user.role : 'guess';
    if (['tthh', 'admin', 'soci'].includes(role)) {
      console.log(role);
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

  cambiarFormatoFecha(fecha: string) {
    return this.dataService.changeDateFormat(fecha)
  }

  async mostrarAlerduplicado(aspirante: any) {
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

  mostrarContenido(contenido: string) {
    let objPage: any = this;
    objPage[contenido] = (objPage[contenido]) ? false : true;
  }

  async mostrarAlerOk(aspirante: any, nuevo?: boolean) {
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
            // this.dataService.getAspirantesApi('aspirante-new');
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

  verificarci(evento: any) {
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

  getDigitoV(cedula: string) {
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

    let objAspirante = this.aspirante
    this.aspirante.asp_estado = 0;
    this.guardando = true;
    // const loading = await this.loadingCtrl.create({
    //   message: '<b>Guardando información... <b><br>Espere por favor',
    //   translucent: true,
    //   duration: 1000,
    // });
    //loading.present()

    this.aspirante.asp_fch_ingreso = this.fechaIngreso.toISOString().substring(0, 19).replace('T', ' ');
    this.aspirante.asp_ing_entrevista = this.fechaEntrevista.replace('T', ' ');
    this.aspirante.asp_fecha_nacimiento = this.fechaNacimiento.toISOString().substring(0, 10).trim()

    this.aspirante.atv_aspirante = this.aspirante.asp_cedula;
    this.aspirante.atv_fingreso = this.aspirante.asp_fch_ingreso;

    delete this.aspirante.asp_id;
    delete this.aspirante['asp_fecha_modificado'];

    const conexion = this.dataService.nuevoAspirante(this.aspirante).subscribe(async (res: any) => {

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
        this.dataService.servPresentAlert("Error de conexion", "<ion-icon name='cloud-offline' ></ion-icon> <ion-label>Se prese/nto un problema de comunicacion con el servidor.</ion-label>", "alertError");
        this.guardando = false;
        conexion.unsubscribe();
      }
    }, 10000);

  }

  async onSubmitUpdate() {
    this.guardando = true;
    this.aspirante.asp_fch_ingreso = this.fechaIngreso.toISOString().substring(0, 19).replace('T', ' ');
    this.aspirante.asp_ing_entrevista = this.fechaEntrevista.replace('T', ' ');
    this.aspirante.asp_fecha_nacimiento = this.fechaNacimiento.toISOString().substring(0, 10).trim()
    // console.log(this.aspirante.asp_fch_ingreso, this.aspirante.asp_ing_entrevista, this.aspirante.asp_fecha_nacimiento);
    // return

    this.aspirante.atv_aspirante = this.aspirante.asp_cedula
    this.aspirante['asp_nombre'] = `${this.aspirante.asp_nombres} ${this.aspirante.asp_apellidop} ${this.aspirante.asp_apellidom}`.toUpperCase()
    //console.log(this.aspirante['asp_nombre'])

    const conexion = this.dataService.updateAspirante(this.aspirante).subscribe(async (res: any) => {

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
        this.dataService.servPresentAlert("Error de conexion", "<ion-icon name='cloud-offline' ></ion-icon> <ion-label>Se presento un problema de comunicacion con el servidor.</ion-label>", "alertError");
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

  actualizarvalor(evento: any, variable: string) {
    // console.log(evento, ' -> ', variable)
    let objPage: any = this;
    if (evento.checked == false) {
      this.aspirante[variable] = 'NO'
      objPage[variable] = false
    }
    else {
      this.aspirante[variable] = 'SI'
      objPage[variable] = true
    }
  }


  activarFormulario() {
    if (!this.soloLectura) {
      return
    }
    this.soloLectura = (this.soloLectura) ? false : true
  }


  cancelarSolicitud() {
    //this.router.navigateBack(['/principal-th']);
    // this.router.navigate(['/inicio/tab-aspirante/principal-th'])
    // this.location.back();
    window.history.back()
    // this.nacCtrl.back();

  }


  setFoto(event: any) {

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


  cambiarMayusculas(e: any, campo: string) {
    const ss = e.target.selectionStart;
    const se = e.target.selectionEnd;
    e.target.value = e.target.value.toUpperCase();
    this.aspirante[campo] = e.target.value.toUpperCase();
    e.target.selectionStart = ss;
    e.target.selectionEnd = se;
  }


  formatMoneda(evento: any): string {
    // Formatear el valor numérico con 2 decimales
    // console.log(this.aspirante.asp_sueldo, evento.target.value)
    //parse(value)
    // const floatValue:number = evento.target.value;
    const floatValue = parseFloat(evento.target.value).toFixed(2)
    this.aspirante.asp_sueldo = floatValue

    // console.log(this.aspirante.asp_sueldo, "$$$ ",floatValue);
    return floatValue ? floatValue : '';
  }

  setValorDecimal(event:any) {
    event.target.value = parseFloat(event.target.value).toFixed(2)
    this.aspirante.asp_sueldo = event.target.value;
  }


  showModalPersonOld(dni) {
    this.isModalOpen = true
    this.dataService.getPersonaDni(dni).subscribe(data => {
      console.log(dni, data);
      this.infoData = data;
      this.infoData.per_familiar = JSON.parse(this.infoData.per_familiar);
    })
  }

  async showModalPerson(cedula:string) {
    console.log(cedula);

    const modal = await this.modalCtrl.create({
      component: FormApiPersonaComponent,
      componentProps: {
        class: "my-modal-class",
        dni: cedula
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (!data || data == undefined || data.role == "cancelar") {
      modal.dismiss()
      return;
    }
    console.log(data)
    // this.aspirante.asp_cargo_area = data.cargo.car_area;
    // this.aspirante.asp_cargo = data.cargo.car_nombre;
    // this.aspirante.asp_sueldo = data.cargo.car_salario;
    // this.aspirante.asp_codigo = data.cargo.car_iess;
  }

  cerrarModal() {
    // console.log(item, this.isModalOpen);
    this.isModalOpen = false;
  }


}

