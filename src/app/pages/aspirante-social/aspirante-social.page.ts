import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import { AspiranteInfo } from '../../interfaces/aspirante';
import { AspiranteSoci, AspiranteFamiliar } from '../../interfaces/aspirante-soci';
import { EmpleadoInfo } from 'src/app/interfaces/empleado';

import { LoadingController, NavController, IonContent, IonSlides } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-aspirante-social',
  templateUrl: './aspirante-social.page.html',
  styleUrls: ['./aspirante-social.page.scss'],
})
export class AspiranteSocialPage implements OnInit {

  // @Input("aspirante") aspirante;

  @ViewChild(IonContent) content: IonContent;
  @ViewChild(IonSlides) slides: IonSlides;

  aspirante = <AspiranteInfo>{}
  empleado = <EmpleadoInfo>{}

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

  infoubicacion: boolean = false;
  infofamiliares: boolean = false;
  infovivienda: boolean = false;
  infoeconomica: boolean = false;
  mensajecedula: string = '';
  ci_valida: boolean = true;
  soloLectura: boolean = true

  guardando = false;

  listas = ['estado', 'paises', 'sexo', 'civil', 'tipo_sangre', 'cargo', 'referencia', 'academico', 'etnia', 'vivienda', 'construccion', 'banco']

  fieldGroups = [
    {
      inputs: [
        { label: 'Nombres', value: '', icon: 'person_add' },
        { label: 'Apellidos', value: '', icon: 'person_add' },
        { label: 'Parentezco', value: '', icon: 'escalator_warning' },
        { label: 'Nivel', value: '', icon: 'school' },
      ],
      inputs_number: [
        { label: 'Grado', value: '', icon: 'school' }
      ],
      selects: [
        { label: 'Sexo', value: '' }
      ],
      date: [
        { label: 'Fecha de nacimiento', value: '' }
      ],
      toggles: [
        { label: 'Estudiando', value: '' },
        { label: 'Trabajando', value: '' }
      ]
    },
    {
      inputs: [
        { label: 'Nombres', value: '', icon: 'person_add' },
        { label: 'Apellidos', value: '', icon: 'person_add' },
        { label: 'Parentezco', value: '', icon: 'escalator_warning' },
        { label: 'Nivel', value: '', icon: 'school' },
      ],
      inputs_number: [
        { label: 'Grado', value: '', icon: 'school' }
      ],
      selects: [
        { label: 'Sexo', value: '' }
      ],
      date: [
        { label: 'Fecha de nacimietnto', value: '' }
      ],
      toggles: [
        { label: 'Estudiando', value: '' },
        { label: 'Trabajando', value: '' }
      ]
    }, {
      inputs: [
        { label: 'Nombres', value: '', icon: 'person_add' },
        { label: 'Apellidos', value: '', icon: 'person_add' },
        { label: 'Parentezco', value: '', icon: 'escalator_warning' },
        { label: 'Nivel', value: '', icon: 'school' },
      ],
      inputs_number: [
        { label: 'Grado', value: '', icon: 'school' }
      ],
      selects: [
        { label: 'Sexo', value: '' }
      ],
      date: [
        { label: 'Fecha de nacimietnto', value: '' }
      ],
      toggles: [
        { label: 'Estudiando', value: '' },
        { label: 'Trabajando', value: '' }
      ]
    }, {
      inputs: [
        { label: 'Nombres', value: '', icon: 'person_add' },
        { label: 'Apellidos', value: '', icon: 'person_add' },
        { label: 'Parentezco', value: '', icon: 'escalator_warning' },
        { label: 'Nivel', value: '', icon: 'school' },
      ],
      inputs_number: [
        { label: 'Grado', value: '', icon: 'school' }
      ],
      selects: [
        { label: 'Sexo', value: '' }
      ],
      date: [
        { label: 'Fecha de nacimietnto', value: '' }
      ],
      toggles: [
        { label: 'Estudiando', value: '' },
        { label: 'Trabajando', value: '' }
      ]
    }, {
      inputs: [
        { label: 'Nombres', value: '', icon: 'person_add' },
        { label: 'Apellidos', value: '', icon: 'person_add' },
        { label: 'Parentezco', value: '', icon: 'escalator_warning' },
        { label: 'Nivel', value: '', icon: 'school' },
      ],
      inputs_number: [
        { label: 'Grado', value: '', icon: 'school' }
      ],
      selects: [
        { label: 'Sexo', value: '' }
      ],
      date: [
        { label: 'Fecha de nacimietnto', value: '' }
      ],
      toggles: [
        { label: 'Estudiando', value: '' },
        { label: 'Trabajando', value: '' }
      ]
    }, {
      inputs: [
        { label: 'Nombres', value: '', icon: 'person_add' },
        { label: 'Apellidos', value: '', icon: 'person_add' },
        { label: 'Parentezco', value: '', icon: 'escalator_warning' },
        { label: 'Nivel', value: '', icon: 'school' },
      ],
      inputs_number: [
        { label: 'Grado', value: '', icon: 'school' }
      ],
      selects: [
        { label: 'Sexo', value: '' }
      ],
      date: [
        { label: 'Fecha de nacimietnto', value: '' }
      ],
      toggles: [
        { label: 'Estudiando', value: '' },
        { label: 'Trabajando', value: '' }
      ]
    },
  ];

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

  constructor(
    private dataService: DataService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private actRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.listas.forEach(element => {

      this.dataService.getAspiranteLData(element).subscribe(lista => {
        this[element] = lista;
        //console.log(this.estado);
      });

    });

  }


  ionViewWillEnter() {

    this.dataService.mostrarLoading$.emit(true)

    this.actRoute.params.subscribe((data: any) => {
      //if (this.dataService.aspirante) {
      //const objaspirante = this.dataService.aspirantes.find(function (item) {
      const objaspirante = this.dataService.aspirantes.find(function (item) {
        return item.asp_cedula === data['asp_cedula']
      });


      //objaspirante.asp_nombres = `${objaspirante.asp_apellidop} ${objaspirante.asp_apellidom} ${objaspirante.asp_nombres}`
      this.aspirante = JSON.parse(JSON.stringify(objaspirante))
      //this.aspirante = JSON.parse(JSON.stringify(nAspirante));
      if (!!this.aspirante['aov_familiar']) {
        this.familiar = JSON.parse(this.aspirante['aov_familiar'])
      }
      if (!!this.aspirante['aov_responsable']) {
        this.responsable = JSON.parse(this.aspirante['aov_responsable'])
      }

      //console.log(this.aspirante['aov_familiar'])
      this.fechaNacimiento = new Date(this.dataService.dataLocal.changeFormat(this.aspirante.asp_fecha_nacimiento));
      this.fechaIngreso = new Date(this.dataService.dataLocal.changeFormat(this.aspirante.asp_fch_ingreso));


      // this.aspirantecodigo = data.asp_codigo
      this.aspirante = JSON.parse(JSON.stringify(objaspirante))
      // console.log(this.aspirante, objaspirante['asp_pais'], this.aspirante['asp_pais']);
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

  cambioFecha(event) {

    console.log(event);
    console.log(new Date(event.detail.value));

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

  async onSubmitTemplate() {
    this.dataService.mostrarLoading()

    let objAspirante = new AspiranteSoci()
    //type objAspirante = typeof AspiranteSoci;
    Object.keys(objAspirante).map(key => {
      //console.log(key)  
      objAspirante[key] = this.aspirante[key];
      //return { text: key, value: key }
    });
    objAspirante['aov_aspirante'] = this.aspirante.asp_cedula;
    objAspirante['asp_estado'] = 12;
    objAspirante['aov_familiar'] = JSON.stringify(this.familiar);
    objAspirante['aov_responsable'] = JSON.stringify(this.responsable);

    const newAspirante = []
    Object.entries(objAspirante).forEach(([key, value]) => {
      // 👇️ name Tom 0, country Chile 1
      if (!!value) {
        newAspirante[key] = value
        // console.log(objLegal[key], value, key);
      }
    });

    console.log(objAspirante, newAspirante)
    // return;

    this.dataService.verifySocial(objAspirante).subscribe(res => {
      console.log(res)
    })
    //console.log('INGRESO', objAspirante)

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
    this.navCtrl.navigateBack(['/inicio']);

  }

  // setSlide(index) {
  //   this.swiper.swiperRef.slideTo(index, 1000);
  //   this.selectSlide = index;
  //   this.content.scrollToTop();
  // }

  slidePrev() {
    this.slides.slidePrev();
  }

  slideNext() {
    this.slides.slideNext();
  }

  updatePageIndex() {
    this.slides.getActiveIndex().then((index) => {
      this.pageIndex = index;
    });
  }

}
