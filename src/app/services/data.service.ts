import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

//import 'rxjs-compat/add/operator/map';
import { Subject } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';
import { DataLocalService } from './data-local.service';
import { AspiranteInfo } from '../interfaces/aspirante';

// const timeoutId = setTimeout( function(conexion) {
//   console.log("17 xxxxx Counter #END -> BD server conn...", conexion, "   time up: ", 85000);
//   //conectado = false;
// }, 8000)

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //server: string = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
  //serverweb: string = "https://promine-ec.000webhostapp.com/servicios";
  serverweb: string = "https://getssoma.com/servicios";

  // serverapi: string = "https://api-promine.onrender.com";

  // serverapi: string = "https://api-promine.vercel.app"; //PRODUCTION -> master
  serverapi: string = "https://api-promine-p8154i2g5-byros21-gmailcom.vercel.app";  //DEV TEST -> andres
  // serverapi: string = "http://localhost:8081";

  aspirante

  isloading = false
  submenu$ = new EventEmitter<any[]>()
  cambioMenu$ = new EventEmitter<String>()
  submenu = []

  aspOpciones$ = new EventEmitter<any>()
  aspItemOpts$ = new EventEmitter<any>()
  mostrarLoading$ = new EventEmitter<boolean>()

  loading;

  estados = [];
  localaspirantes$: Subject<any>;

  aspirantes$ = new EventEmitter<boolean>();
  aspirantes: AspiranteInfo[] = [];
  servicio_listo: boolean = false;

  timeoutId;

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public dataLocal: DataLocalService

  ) {

    this.loadInitData();

    this.mostrarLoading$.subscribe(res => {
      //console.log(res)
      if (res == true) {
        //this.isloading = true;
        this.mostrarLoading();
      } else {
        //this.isloading = false;
        this.cerrarLoading();
      }
    })

    //this.localaspirantes$ = new Subject();

    this.dataLocal.aspirantesLocal$.subscribe(lista => {
      // console.log("Emitter -> data-Service >> Lista aspirantes", lista.length, lista)
      this.aspirantes = lista;
      // if (lista.length == 0) {
      //   //this.listadoPorDepartamento("tthh", 0, true);
      // } else {
      if (this.servicio_listo)
        this.aspirantes$.emit(true);
      //}

    })
  }

  async loadInitData() {
    this.getAspiranteLData("estado-grupo").subscribe(lista => {
      this.estados = lista;
      //this.estado = lista[0];

    });

    setTimeout(() => {
      //await this.getAspirantesApi();
    }, 1000);

  }

  getMenu() {
    return this.http.get("/assets/data/menu.json")
  }

  getMenuPrincipal() {
    return this.http.get<any[]>("/assets/data/menu-principal.json");
  }

  getSubMenu(nombre) {

    const lista = []

    this.http.get("/assets/data/submenu.json").subscribe((res: any[]) => {


      res.forEach(element => {

        if (element['padre'] === nombre) {
          //console.log(element)
          lista.push(element)
        }

      });

      this.submenu = lista;
    })

    this.submenu$.emit(lista);

    return lista

  }

  setSubmenu(item) {

    this.cambioMenu$.emit(item)

  }

  async getItemOpciones(aspirante, departamento = 'tthh') {

    return new Promise((resolve, reject) => {

      this.http.get("/assets/data/item-opcion.json").subscribe((data: any[]) => {

        let listaBotones = [];
        let botones = [];
        if (departamento == 'tthh') {

          if (aspirante.asp_estado == 1 || aspirante.asp_estado == 2 ||
            aspirante.asp_estado == 3) {

            listaBotones = ['tthh-verificar-legal', 'detalle-proceso', 'cancelar'];
            this.aspirante = this.cambiarBool(aspirante)
            aspirante = this.cambiarBool(aspirante)

          } else if (aspirante.asp_estado == 4 || aspirante.asp_estado == 5) {

            listaBotones = ['tthh-autorizar-psico', 'detalle-proceso', 'cancelar'];


          } else if (aspirante.asp_estado == 7 || aspirante.asp_estado == 8) {

            listaBotones = ['tthh-autorizar-psico', 'detalle-proceso', 'cancelar'];
            if (aspirante.asp_estado == 8) {
              listaBotones = ['tthh-no-apto', 'detalle-proceso', 'cancelar'];
            }

            //this.getAspiranteRole(aspirante['asp_cedula'], 'tthh').subscribe(res => {
            this.aspirante = this.cambiarBool(aspirante)
            aspirante = this.cambiarBool(aspirante)
            //})

          } else if (aspirante.asp_estado == 10) {

            listaBotones = ['tthh-finalizar-rev', 'detalle-proceso', 'cancelar'];

            this.getAspiranteRole(aspirante['asp_cedula'], 'tthh').subscribe(res => {
              this.aspirante = this.cambiarBool(res['aspirante'])
              aspirante = this.cambiarBool(res['aspirante'])
            })

          } else if (aspirante.asp_estado == 11) {

            listaBotones = ['tthh-finalizar-cont', 'detalle-proceso', 'cancelar'];

            this.getAspiranteRole(aspirante['asp_cedula'], 'tthh').subscribe(res => {
              if (aspirante.asp_aprobacion == false) {
                listaBotones = ['tthh-finalizar-rev', 'detalle-proceso', 'cancelar'];
              }
              listaBotones = ['tthh-autorizar-psico', 'detalle-proceso', 'cancelar'];
              this.aspirante = this.cambiarBool(res['aspirante'])
              aspirante = this.cambiarBool(res['aspirante'])
            })

          }



        } else if (departamento == 'medi') {
          //if (aspirante.asp_estado == 'VERIFICADO' || aspirante.asp_estado == 'EXAMENES' || aspirante.asp_estado == 'NO APROBADO') {

          listaBotones = ['medi-certificado', 'aspirante-ficha', 'cancelar'];
          this.aspirante = this.cambiarBool(aspirante)
          aspirante = this.cambiarBool(aspirante)

          //} 

        } else if (departamento == 'psico') {
          //if (aspirante.asp_estado == 'VERIFICADO' || aspirante.asp_estado == 'EXAMENES' || aspirante.asp_estado == 'NO APROBADO') {

          listaBotones = ['psico-verificar', 'psico-certificado', 'aspirante-ficha', 'cancelar'];
          this.aspirante = this.cambiarBool(aspirante)
          aspirante = this.cambiarBool(aspirante)

          //} 
        } else if (departamento == 'segu') {
          //if (aspirante.asp_estado == 'VERIFICADO' || aspirante.asp_estado == 'EXAMENES' || aspirante.asp_estado == 'NO APROBADO') {

          listaBotones = ['segu-verificar', 'aspirante-ficha', 'cancelar'];
          this.aspirante = this.cambiarBool(aspirante)
          aspirante = this.cambiarBool(aspirante)

          //} 
        } else if (departamento == 'soci') {
          //if (aspirante.asp_estado == 'VERIFICADO' || aspirante.asp_estado == 'EXAMENES' || aspirante.asp_estado == 'NO APROBADO') {

          listaBotones = ['soci-verificar', 'aspirante-ficha', 'cancelar'];
          this.aspirante = this.cambiarBool(aspirante)
          aspirante = this.cambiarBool(aspirante)

          //} 
        }

        listaBotones.forEach(element => {
          const nombre = data.find((e) => {
            if (e.name === element) {
              botones.push(e)
            }
          });
        });

        (data)
          ? resolve({ botones, aspirante })
          : reject(`NO Existe! *id = 'opcion1txt'`);

      });

    })

    //return {aspirante, botones};

  }

  cambiarBool(aspirante) {

    (Object.keys(aspirante) as (keyof typeof aspirante)[]).forEach((key, index) => {
      //let x:string = "Hola"; x.toLowerCase()
      if (aspirante[key] === "true" || aspirante[key] === "TRUE") {
        aspirante[key] = true
        // console.log(key, aspirante[key], index);
      } else if (aspirante[key] == "false" || aspirante[key] === "FALSE") {
        aspirante[key] = false
        // console.log(key, aspirante[key], index);
      }
      // 👇️ name Tom 0, country Chile 1
    })

    //this.dataService.aspirante = aspirante;
    return aspirante

    // }, 2000);

  }

  getAspiranteLData(lista: string) {
    return <any>this.http.get("/assets/data/aspirantes/" + lista + ".json")
  }

  getEmpleadoLData(lista: string) {
    return <any>this.http.get("/assets/data/empleados/" + lista + ".json")
  }

  getListanuevos(texto) {
    const body = JSON.stringify({ 'task': 'buscar', texto })
    //const x = parse this.serverweb + "/aspirante.php/?" + body
    //return this.http.get(this.serverweb + "/library/config.php")
    //return this.http.get(`${this.serverweb}/aspirante.php/?${body}`)
    return this.http.post(this.serverweb + "/aspirante.php", body)
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  nuevoAspirante(aspirante) {
    let body

    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      aspirante[key] = (!!value) ? value.toString().trim() : '';

      if (key.substring(0, 4) == "asp_") {
        //console.log(key,value);
        aspirante[key] = value?.toString().toUpperCase()//:value;
      }
    });

    body = { ...aspirante, task: 'nuevo' };
    body['asp_edad'] = body['asp_edad'].toString()
    //console.log(body)
    //console.log(JSON.stringify(body))
    return this.http.post(this.serverapi + "/aspirante/nuevo", body)

  }

  updateAspirante(aspirante) {
    let body

    let nAspirante = {};

    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      const siglas = key.substring(0, 4)
      if (siglas == "asp_" && key != 'asp_fecha_modificado' && key != 'asp_nombre') {
        nAspirante[key] = value.toString().toUpperCase()
        //console.log(key)
      } /*else if (key.substring(0, 4) == "atv_") {
        aspirante[key] = value.toString()
      }*/
    });

    body = { ...nAspirante, task: 'actualizar' };
    //console.log(body) 

    //return this.http.post(this.serverweb + "/aspirante.php", JSON.stringify(body))
    return this.http.put(this.serverapi + "/aspirante", body);

    //return xx;
  }

  updateAspiranteLocal(aspirante, nuevo = false) {

    this.dataLocal.guardarAspirante([aspirante], nuevo)

  }


  verifyTalento(aspirante) {
    this.mostrarLoading(this.loading)
    let body

    let objTalento = {}

    aspirante["atv_aspirante"] = aspirante.asp_cedula;
    aspirante["atv_fingreso"] = aspirante.asp_fch_ingreso;
    //console.log(aspirante["asp_fch_ingreso"]," *** ", fingreso);
    // return;

    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      if (key.substring(0, 4) == "atv_" && key !== "atv_id") {
        //console.log({key,value});
        objTalento[key] = value.toString() || aspirante.asp_
      }
    });

    objTalento['asp_estado'] = aspirante['asp_estado']
    body = { ...objTalento };

    //console.log(body)
    // return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(body))
    return this.http.post(this.serverapi + "/validar/tthh", body)

  }

  verifyMedicina(aspirante) {
    let body

    let objTalento = {}

    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      if (key.substring(0, 4) == "amv_") {
        objTalento[key] = value.toString()
      }
    });

    objTalento['asp_estado'] = aspirante['asp_estado']
    body = { ...objTalento, task: 'medicina1' };

    console.log(body)
    return this.http.post(this.serverapi + "/validar/medi", body)
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  verifyPsicologia(aspirante) {
    this.mostrarLoading('Subiendo archivo. Espere por favor hasta que finalice el proceso.')
    let body

    let objTalento = {}

    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      if (key.substring(0, 4) == "apv_" && key != "apv_id") {
        objTalento[key] = value.toString()
      }
    });

    objTalento['asp_estado'] = aspirante['asp_estado']
    body = { ...objTalento, task: 'psicologia1' };

    //console.log(body)
    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }


  verifySeguridad(aspirante) {
    let body

    let objTalento = {}

    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      if (key.substring(0, 4) == "asv_") {
        objTalento[key] = value.toString()
      }
    });

    objTalento['asp_estado'] = aspirante['asp_estado']
    body = { ...objTalento, task: 'seguridad1' };

    //console.log(body)
    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  verifySocial(aspirante) {
    let body

    let objSocial = {}

    body = { ...aspirante, task: 'social1' };

    //console.log(body)
    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  autorizarExocupacion(aspirante) {

    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(aspirante))

  }

  autorizarPsicologia(aspirante) {

    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(aspirante))

  }

  autorizarDocumentacion(aspirante) {

    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(aspirante))

  }

  async getAspirante(cedula) {
    this.dataLocal.getAspirante(cedula).then((res) => {
      console.log(res);
      return res
    })
  }



  refreshTimeup(conexion, segundos: number = 10) {
    //console.log("Timer @@@ --> ", this.timeoutId)

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      //return
    }

    this.timeoutId = setTimeout(() => {
      console.log("close subscripcion", "   time up: ", segundos, "seg");
      //conectado = false;
      conexion.unsubscribe();
    }, segundos * 1000)

  }

  async getAspirantesApi() {

    //aspirante['asp_estado']
    //body['asp_edad'] = body['asp_edad'].toString()

    let ultimo = this.dataLocal.getUltimo();
    //let localList //= [];
    //const body = { task: 'aspiranterol', asp_estado: departamento, estado: id, historial };
    const body = { task: 'aspiranterol', asp_estado: "tthh", historial: false, fecha: ultimo };


    console.log("GET API **Aspirantes fecha >= ", ultimo)

    //try {

    const conexion = this.http.post(this.serverapi + "/aspirante/listar", body).subscribe((data: any) => {

      //cerraConexion.refresh();
      if (data.length > 0) {
        console.log("API -> Nuevos elemens", data.length)
        //console.log("Nuevos elementos -> ", data.length)
        this.dataLocal.guardarAspirante(data)
        //this.localaspirantes$.next({ aspirantes: localList });
      } else {
        //this.localaspirantes$.next({ aspirantes: [] });
        this.aspirantes$.emit(false)

      }

      conexion.unsubscribe();
    })

    //this.iniciarTimeup(consulta);
    this.refreshTimeup(conexion);
    //retu


  }


  async listadoPorDepartamento(departamento, id, historial = false) {

    //aspirante['asp_estado']
    //body['asp_edad'] = body['asp_edad'].toString()

    let ultimo = this.dataLocal.getUltimo();
    //let localList //= [];
    //const body = { task: 'aspiranterol', asp_estado: departamento, estado: id, historial };
    const body = { task: 'aspiranterol', asp_estado: departamento, estado: id, historial: historial, fecha: ultimo };


    console.log("Ultimo actalizado -> ", ultimo)

    //return
    //this.dataLocal.getUltimo().then(res => {
    //ultimo = res
    //body.task = "listado-full"
    //body.fecha = ultimo;
    //console.log(departamento, id, historial,body)  
    //console.log(body, JSON.stringify(body))  

    try {

      this.http.post(this.serverapi + "/aspirante/listar", body).subscribe((data: any) => {


        if (data.length) {
          console.log("Nuevos elementos -> ", data.length)
          this.dataLocal.guardarAspirante(data)
          //this.localaspirantes$.next({ aspirantes: localList });
        } else {
          //this.localaspirantes$.next({ aspirantes: [] });
        }

        //this.aspirantes$.emit(this.aspirantes);
        console.log("####### wtf?? ######## res -> ", data)
        this.aspirantes$.emit(false);
      });

      //return {aspirantes:this.dataLocal.filterEstado(departamento, id, historial)}
    } catch {
      console.log("ERROR -> ")

    }


    //return await localList;

    // return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(body))

    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  filterAspirantes(departamento, id, historial) {

    return { aspirantes: this.dataLocal.filterEstado(departamento, id, historial) }

  }

  getAspiranteRole(cedula, role) {
    let body

    //aspirante['asp_estado']
    body = { task: 'getaspiranterol', cedula, role };
    //body['asp_edad'] = body['asp_edad'].toString()

    //console.log(JSON.stringify(body))  
    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  getResponsables() {

    //const body = { task: 'listarresponsables' };
    //body['asp_edad'] = body['asp_edad'].toString()

    //console.log(JSON.stringify(body))  
    //this.http.get(this.serverapi + "/aspirante/listar", body).subscribe((data: any[]) => {

    return this.http.get(this.serverapi + "/general/responsables")
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  async mostrarLoading(mensaje?) {

    //console.log(this.isloading,mensaje);

    if (this.isloading == true) return; else {
      this.isloading = true;
    }
    mensaje = mensaje || 'Casi esta todo listo';

    const message = `<p class='texto1'>${mensaje}</p> <p class='texto2'> <ion-spinner name='dots'> </ion-spinner> espera un momento </p>`;

    this.loading = await this.loadingCtrl.create({
      message,
      duration: 5000,
      spinner: null,
      cssClass: 'iloading-data'
    });

    this.loading.present();
  }

  async cerrarLoading() {

    //if(this.isloading==false) return;

    setTimeout(async () => {
      if (await this.loadingCtrl.getTop() !== undefined)
        await this.loadingCtrl.dismiss();
      else this.cerrarLoading();

      this.isloading = false;
    }, 1000);
  }


  async presentAlert(titulo, mensaje, clase = "alertExamenes") {
    const alert = await this.alertCtrl.create({
      header: titulo,
      //subHeader: 'Subtitle',
      cssClass: ['alertMensaje', clase],
      message: mensaje,
      translucent: false,
      buttons: ['Cerrar']
    });

    setTimeout(() => {
      alert.present();
    }, 1000);

  }



  newObjAspirante(aspirante) {

    aspirante.asp_cedula = ""
    aspirante.asp_codigo = ""
    aspirante.asp_nombres = ""
    aspirante.asp_apellidop = ""
    aspirante.asp_apellidom = ""
    aspirante.asp_pais = ""
    aspirante.asp_sexo = ""
    aspirante.asp_edad = ""
    aspirante.asp_correo = ""
    aspirante.asp_ecivil = ""
    aspirante.asp_gpo_sanguineo = ""
    aspirante.asp_cargo = ""
    aspirante.asp_sueldo = ""
    aspirante.asp_conadis = ""
    aspirante.asp_nro_conadis = ""
    aspirante.asp_discapacidad = ""
    aspirante.asp_porcentaje = ""
    aspirante.asp_experiencia = ""
    aspirante.asp_nmb_experiencia = ""
    aspirante.asp_ing_entrevista = ""
    aspirante.asp_fch_ingreso = ""
    aspirante.asp_telefono = ""
    aspirante.asp_direccion = ""
    aspirante.asp_hora_entrevista = ""
    aspirante.asp_referencia = ""
    aspirante.asp_estado = ""
    aspirante.asp_observaciones = ""
    aspirante.asp_observacion_medico = ""
    aspirante.asp_observacion_final = ""
    aspirante.asp_academico = ""
    aspirante.asp_fecha_nacimiento = ""
    aspirante.asp_militar = ""
    aspirante.asp_aprobacion = "false"
    aspirante.asp_evaluacion = ""
    aspirante.asp_condicion = ""
    aspirante.asp_lugar_nacimiento = ""
    aspirante.asp_etnia = ""
    aspirante.asp_religion = ""
    aspirante.asp_banco = ""
    aspirante.asp_nro_cuenta = ""
    aspirante.asp_nombre_familiar = ""
    aspirante.asp_parentezco_familiar = ""
    aspirante.asp_telefono_familiar = ""
    aspirante.asp_descripcion_vivienda = ""
    aspirante.asp_referencia_vivienda = ""
    aspirante.asp_cargas = ""
    aspirante.asp_cargas_primaria = ""
    aspirante.asp_cargas_secundaria = ""
    aspirante.asp_vivienda = ""
    aspirante.asp_construccion = ""
    aspirante.asp_movilizacion = ""
    aspirante.asp_recomendado = ""


    aspirante.atv_aspirante = ""
    aspirante.atv_fingreso = ""
    aspirante.atv_fverificado = ""
    aspirante.atv_plegales = "false"
    aspirante.atv_pfiscalia = "false"
    aspirante.atv_ppenales = "false"
    aspirante.atv_plaborales = "false"
    aspirante.atv_verificado = "false"
    aspirante.atv_aprobado = "NO"

    return aspirante
  }

}


