import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ModalController, AlertController, IonContent } from '@ionic/angular';

import { Swiper } from "swiper";
import jsonData from '../../../assets/data/empleados/list_epp.json';
//import from '../assets/data/empleados/list_epp.json';

@Component({
  selector: 'app-form-validar-segu',
  templateUrl: './form-validar-segu.component.html',
  styleUrls: ['./form-validar-segu.component.scss'],
})


export class FormValidarSeguComponent {

  @Input("aspirante") aspirante: any;
  @Input("rol") rol: any;
  @Input("objmodal") modal: any;
  @ViewChild(IonContent) content: IonContent | undefined;

  @ViewChild('swiper') swiperRef: ElementRef | undefined;
  swiper?: Swiper;

  lista_epp: any = [];
  lista_filter: any[] = [];
  lista_filter2: any[] = [];
  aspirante_epp: any = [];
  listaObservaciones = [];
  validado = false

  selectSlide = 0;
  validado1 = false

  asp_edad: any = ''
  loading: boolean = false;

  file_Induccion: any = '';
  file_Procedimiento: any = '';
  file_Certificacion: any = '';
  file_Entrenamiento: any = '';
  file_Matrizriesgos: any = '';
  file_Evaluacion: any = '';

  existeInduccion: boolean = false;
  existeProcedimiento: boolean = false;
  existeCertificacion: boolean = false;
  existeEntrenamiento: boolean = false;
  existeMatrizriesgos: boolean = false;
  existeEvaluacion: boolean = false;

  generandoInduccion: boolean = false;
  generandoProcedimiento: boolean = false;
  generandoCertificacion: boolean = false;
  generandoEntrenamiento: boolean = false;
  generandoMatrizriesgos: boolean = false;
  generandoEvaluacion: boolean = false;

  isbuscando: boolean = false;
  txtbusqueda = '';
  filterText = '';

  @ViewChild('list', { read: ElementRef })
  list: ElementRef | undefined;
  lista_element = null;

  startX: number | undefined;
  startY: number | undefined;
  moviendolista: boolean = false;

  customAlertOptions = {
    header: 'Listado de EPP',
    translucent: true,
  };

  // objPage: any = {};

  constructor(
    public modalController: ModalController,
    public alertController: AlertController
  ) { }


  ngOnInit() {
    // this.objPage = this;

    this.lista_epp = jsonData;

    this.aspirante.asv_verificado = (this.aspirante.asv_verificado === 'true' || this.aspirante.asv_verificado === true) ? true : false;
    if (this.aspirante.asp_estado == 8 || !this.aspirante.asp_estado)
      this.aspirante.asp_estado = 10;

    // if( !!this.aspirante?.asv_equipo )
    this.aspirante_epp = JSON.parse(this.aspirante?.asv_equipo) || [];

    if (this.aspirante == true)
      this.validado = true

  }


  ionViewDidEnter() {
    this.getEdad()
  }


  swiperReady() {
    this.swiper = this.swiperRef?.nativeElement.swiper;
  }


  getEdad() {
    //convert date again to type Date
    const bdate = new Date(this.aspirante.asp_fecha_nacimiento);
    const timeDiff = Math.abs(Date.now() - bdate.getTime());
    this.asp_edad = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    //console.log(this.asp_edad)
  }


  cambiarCheckbox(campo: string, event: any) {
    // console.log(event)
    if (event.detail.checked == true || event.detail.checked == false)
      this.aspirante[campo] = event.detail.checked
    //this.verificarCheckbox()

  }


  cerrarModal() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss();
  }


  archivoListo(archivo: any, variable: string) {
    this["file_" + variable] = archivo;
    this["existe" + variable] = true;
    // console.log(variable);
  }

  finalizarCambios() {
    var validado = true

    const fecha: Date = new Date()
    const fverificado = fecha.toISOString().substring(0, 11).replace('T', ' ') + fecha.toTimeString().substring(0, 8)
    this.aspirante.asv_fverificado = fverificado;
    this.aspirante.asv_verificado = true;
    this.aspirante.asv_aspirante = this.aspirante.asp_cedula;
    this.aspirante.asv_equipo = JSON.stringify(this.aspirante_epp)

    this.aspirante.asv_equipo = JSON.stringify(this.aspirante_epp);

    this.modalController.dismiss({
      aspirante: this.aspirante,
      induccion: (this.existeInduccion) ? this.file_Induccion : '',
      procedimiento: (this.existeProcedimiento) ? this.file_Procedimiento : '',
      certificacion: (this.existeCertificacion) ? this.file_Certificacion : '',
      entrenamiento: (this.existeEntrenamiento) ? this.file_Entrenamiento : '',
      matrizriesgos: (this.existeMatrizriesgos) ? this.file_Matrizriesgos : '',
      evaluacion: (this.existeEvaluacion) ? this.file_Evaluacion : '',
      validado
    });
  }


  async presentAlert() {

    const alert = await this.alertController.create({
      header: '¿Desea guardar los cambios realizados en la solicitud del aspirante?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('#Cancelado');
          }
        },
        {
          text: 'CONFIRMAR',
          role: 'confirm',
          handler: () => {
            //console.log('Alert GUARDAR');
            this.finalizarCambios()
          }
        }
      ]
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    //console.log(role + " Clic!!")
    //this.roleMessage = `Dismissed with role: ${role}`;
  }

  validarSlide1() {
    this.validado1 = true;
    //console.log(this.validado1)
  }

  setSlide(index: number) {
    // console.log(this.swiper, " ########## ############ #### ");
    this.swiper?.slideTo(index, 1000)
    this.selectSlide = index;
    this.content?.scrollToTop();
  }


  handleChange(event: any) {
    const query = event.target.value.toLowerCase();
    // console.log(" ## Change event()", query);
    if (query.length == 0) {
      this.lista_filter = [];
      this.isbuscando = false;
      return;
    }

    this.lista_filter = jsonData.filter(d => d.item.toLowerCase().indexOf(query) > -1 || d.codigo.indexOf(query) > -1).slice(0, 4);
    this.isbuscando = false;
  }

  handleClear() {
    setTimeout(() => {
      // this.lista_filter = [];
      this.isbuscando = false;
    }, 500);
  }

  handleBlur() {
    if (!this.isbuscando)
      this.isbuscando = true
    //console.log(" ** Input focus()");

  }

  addArticulo(event: any) {
    // console.log(event);
    let asp_epp: any = {
      codigo: event.codigo,
      item: event.item,
      cantidad: 1
    }
    this.txtbusqueda = '';
    this.aspirante_epp.push(asp_epp)
    this.lista_filter = [];

    // const el = `item-cantidad-${this.aspirante_epp.length - 1}`
    setTimeout(() => {

      const ioninput = document.getElementById(`item-cantidad-${this.aspirante_epp.length - 1}`)?.firstChild as HTMLInputElement

      // let ioninput = x.firstChild as HTMLInputElement;
      // console.log(ioninput)
      // ioninput.id = "native-text-" + id.toString();
      //el.focus();
      ioninput.focus()
      ioninput.select()

      //x.childNodes[0].foc
    }, 200);
  }

  setArticulo(event: any) {
    event.detail.value.forEach((element: any) => {
      const index = this.aspirante_epp.findIndex((item: any) => item.codigo === element.codigo)
      if (index < 0)
        this.addArticulo(element)
      // console.log(index)
    });
  }

  getNombreStyle(cadena: any) {
    const srtbus = this.txtbusqueda.trim().toUpperCase();
    // console.log(srtbus);
    return cadena.replace(srtbus, '<b>' + srtbus + '</b>') as HTMLElement;
  }

  delArticulo(index: number) {
    this.aspirante_epp.splice(index, 1);
  }

  isInAspiranteEpp(elemento: any) {
    return this.aspirante_epp.some((item: any) => item.codigo === elemento.codigo);
  }


  async openListaEpp(eppselect: any, event?: any) {
    this.lista_filter2 = this.lista_epp;

    eppselect.value = this.aspirante_epp;

    await eppselect.open().then(async () => { })
    /*const alertHeader = document.getElementsByClassName('alert-head sc-ion-alert-ios')[0];
    alertHeader.innerHTML += `<ion-input placeholder="Equipos y herramientas" [debounce]="1000" (ionChange)="buscarAlertEpp($event)" style="text-align: center;"> 
      <ion-icon aria-hidden="true" name="search-circle-outline" color="warning" size="large"></ion-icon>
    </ion-input>`;
  });*/
    let alert: any = document.querySelector('ion-alert');
    let input = document.createElement('ion-input');
    input.placeholder = 'Buscar equipos y herramientas';
    input.debounce = 500;
    input.autofocus = true;
    input.style.textAlign = 'center';
    input.innerHTML += '<ion-icon aria-hidden="true" name="search-circle-outline" color="warning" size="large" style="margin-left:3rem;"></ion-icon>';
    //input.style = "text-align: center;";

    input.addEventListener('ionChange', (ev: any) => {
      const searchTerm = ev.target['value'];
      this.lista_filter2 = this.lista_epp.filter((articulo: any) => {
        return (
          articulo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          articulo.item.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    });

    const inputWrapper = document.createElement('div');
    inputWrapper.appendChild(input);
    alert.querySelector('.alert-checkbox-group')?.before(inputWrapper);

    // console.log(this.lista_epp.length, this.aspirante_epp,"***", eppselect.value);

    // const alert = await eppselect.getOverlay();
    /*alert.onDidPresent().then(async () => {
      const alertHeader = document.getElementsByClassName('alert-head sc-ion-alert-ios')[0];
      alertHeader.innerHTML += `<ion-input placeholder="Equipos y herramientas" [debounce]="1000" (ionChange)="buscarAlertEpp($event)" style="text-align: center;"> 
        <ion-icon aria-hidden="true" name="search-circle-outline" color="warning" size="large"></ion-icon>
      </ion-input>`;
      console.log(alertHeader, this.lista_epp.length);
    });*/

  }

  buscarAlertEpp(event: any) {
    const query = event.target.value.toLowerCase();
    console.log(" ## Change event()", query);
    this.lista_filter2 = jsonData.filter(d => d.item.toLowerCase().indexOf(query) > -1 || d.codigo.indexOf(query) > -1);
  }


  onMouseDown(event: MouseEvent, tooltip?: any) {
    tooltip.hide();
    // event.stopPropagation();
    event.preventDefault();
    const lista_element: any = document.getElementById('lista-epp')
    // console.log("onMouseDown", lista_element, event, this.list);
    this.startX = event.clientX - lista_element.offsetLeft + 50;
    this.startY = event.clientY - lista_element.offsetTop + 50;

    const lista: any = this.list
    const startX = this.startX
    const startY = this.startY
    let moviendolista = this.moviendolista;
    // document.addEventListener('mouseup', onMouseUp.bind(this));
    // lista.nativeElement.removeEventListener('click', this.addArticulo)
    lista.nativeElement.addEventListener('mouseup', onMouseUp);
    lista.nativeElement.addEventListener('mousemove', onMouseMove);
    moviendolista = true;

    function onMouseMove(event: MouseEvent) {
      // console.log("onMouseMove", startX, this.moviendolista);
      const left = event.clientX - startX;
      const top = event.clientY - startY;
      lista.nativeElement.style.left = `${left}px`;
      lista.nativeElement.style.top = `${top}px`;
    }

    function onMouseUp(event: MouseEvent) {
      event.preventDefault();
      event.stopPropagation()
      // console.log("onMouseUp", lista_element, event, lista);
      moviendolista = false;
      lista.nativeElement.removeEventListener('mousemove', onMouseMove)
      lista.nativeElement.removeEventListener('mouseup', onMouseUp)
      //event.preventDefault();
    }

  }



}
