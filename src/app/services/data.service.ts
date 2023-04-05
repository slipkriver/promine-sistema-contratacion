import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
//import 'rxjs-compat/add/operator/map';
import { Subject } from 'rxjs';
import { LoadingController, AlertController, AlertButton } from '@ionic/angular';
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
  // serverapi: string = "https://api-promine-git-andres-byros21-gmailcom.vercel.app";  //DEV TEST -> andres
  serverapi: string = "http://localhost:8081";

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

          if (aspirante.asp_estado == 0) {
            listaBotones = ['tthh-verificar-legal', 'detalle-proceso', 'cancelar'];
            this.aspirante = this.cambiarBool(aspirante)
            aspirante = this.cambiarBool(aspirante)

          } else if (aspirante.asp_estado == 1) {
            listaBotones = ['tthh-no-apto', 'detalle-proceso', 'cancelar'];
            
          } else if (aspirante.asp_estado == 2) {
            listaBotones = ["tthh-verificar-legal", 'detalle-proceso', 'cancelar'];

          } else if ([3, 6, 9, 12, 15].includes(aspirante.asp_estado)) {
            listaBotones = ['detalle-proceso', 'cancelar'];

          } else if (aspirante.asp_estado == 4) {
            listaBotones = ['tthh-autorizar-psico', 'detalle-proceso', 'cancelar'];
            this.aspirante = this.cambiarBool(aspirante)
            aspirante = this.cambiarBool(aspirante)
            //})

          } else if (aspirante.asp_estado == 7) {
            listaBotones = ['tthh-autorizar-legal', 'detalle-proceso', 'cancelar'];
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
        } else if (departamento == 'legal') {
          //if (aspirante.asp_estado == 'VERIFICADO' || aspirante.asp_estado == 'EXAMENES' || aspirante.asp_estado == 'NO APROBADO') {

          listaBotones = ['legal-validar', 'aspirante-ficha', 'cancelar'];
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
    // body['asp_edad'] = body['asp_edad'].toString()
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
      if ((key.substring(0, 4) === "amv_") && key!=='amv_id') {
        objTalento[key] = (!!value)?value.toString():'';
      }
    });

    objTalento['asp_estado'] = aspirante['asp_estado']
    body = { ...objTalento, task: 'medicina1' };

    // console.log(body)
    return this.http.post(this.serverapi + "/validar/medi", body)
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  verifyPsicologia(aspirante) {
    this.mostrarLoading('Subiendo archivo. Espere por favor hasta que finalice el proceso.')
    let body

    let objTalento = {}

    // return
    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      
      if (key.substring(0, 4) == "apv_" && key != "apv_id") {
        // console.log(objTalento[key], value, key);
        
        objTalento[key] = (!!value)?value.toString():'';
      }
    });

    
    objTalento['asp_estado'] = aspirante['asp_estado']
    body = { ...objTalento, task: 'psicologia1' };
    // console.log(body);

    return this.http.post(this.serverapi + "/validar/psico", body)

    //console.log(body)
    // return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }


  verifyLegal(aspirante) {
    this.mostrarLoading('Guardando los cambios realizados. ')
    let body

    let objLegal = {}

    // return
    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      
      if (key.substring(0, 4) == "alv_" && key != "alv_id" && key != "alv_fverificado") {
        if(value == false){
          objLegal[key] = "false"
          // console.log(objLegal[key], value, key);
        }else{
          objLegal[key] = (value!='' && value!=null )?value.toString():'';
        }
      }
    });

    
    objLegal['asp_estado'] = aspirante['asp_estado']
    body = { ...objLegal, task: 'legal1' };
    // console.log(body);

    // return
    return this.http.post(this.serverapi + "/validar/legal", body)

  }


  verifySeguridad(aspirante) {
    let body

    let objSeguridad = {}
    // console.log(aspirante)

    Object.entries(aspirante).forEach(([key, value]) => {
      // 👇️ name Tom 0, country Chile 1
      if (key.substring(0, 4) == "asv_" && key != "asv_id" && key != "asv_fverificado") {
        if(value === false){
          objSeguridad[key] = "false"
          // console.log(objLegal[key], value, key);
        }else{
          objSeguridad[key] = (value!='' && value!=null )?value.toString():'';
        }
      }
    });

    objSeguridad['asp_estado'] = aspirante['asp_estado']
    body = { ...objSeguridad, task: 'seguridad1' };

    // console.log(body)
    // return;
    return this.http.post(this.serverapi + "/validar/segu", body)

  }

  verifySocial(aspirante) {
    let body

    let objSocial = {}

    body = { ...aspirante, task: 'social1' };

    //console.log(body)
    return this.http.post(this.serverapi + "/validar/segu", body)

    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  autorizarExocupacion(aspirante) {
    //console.log(JSON.stringify(aspirante));
    return this.http.post(this.serverapi + "/validar/actualizar", aspirante)
  }

  autorizarPsicologia(aspirante) {
    //console.log(JSON.stringify(aspirante));
    return this.http.post(this.serverapi + "/validar/actualizar", aspirante)

  }

  autorizarDocumentacion(aspirante) {

    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(aspirante))

  }

  async getAspirante(cedula) {
    this.dataLocal.getAspirante(cedula).then((res) => {
      //console.log(res);
      return res
    })
  }



  refreshTimeup(conexion, segundos: number = 25) {
    //console.log("Timer @@@ --> ", this.timeoutId)

    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
      //return
    }

    this.timeoutId = setTimeout(() => {
      // console.log("close subscripcion", "   time up: ", segundos, "seg");
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


    let ultimo = this.dataLocal.getUltimo();

    const body = { task: 'aspiranterol', asp_estado: departamento, estado: id, historial: historial, fecha: ultimo };


    console.log("Ultimo actalizado -> ", ultimo)

    try {

      this.http.post(this.serverapi + "/aspirante/listar", body).subscribe((data: any) => {

        if (data.length) {
          console.log("Nuevos elementos -> ", data.length)
          this.dataLocal.guardarAspirante(data)
          //this.localaspirantes$.next({ aspirantes: localList });
        } else {
          //this.localaspirantes$.next({ aspirantes: [] });
        }

        console.log("####### wtf?? ######## res -> ", data)
        this.aspirantes$.emit(false);
      });

    } catch {
      console.log("ERROR -> ")

    }


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

    // console.log(this.isloading,mensaje);

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

   await this.loading.present();
  }

  async cerrarLoading() {

    // console.log(this.isloading,"CLOSE modal");

    setTimeout(async () => {
      if (await this.loadingCtrl.getTop() !== undefined)
      // if(this.isloading==true)
        await this.loadingCtrl.dismiss();
      // else this.cerrarLoading();

      this.isloading = false;
    }, 1000);
  }


  async presentAlert(titulo, mensaje, clase = "alertExamenes") {
    
    mensaje = mensaje + " ....."
    const alert = await this.alertCtrl.create({
      header: titulo,
      //subHeader: 'Subtitle',
      cssClass: ['alertMensaje', clase],
      message: mensaje,
      translucent: false,
      buttons: [
        {
          text: `Cerrar en 5`,
          role: 'cancel',
          handler: () => {
            console.log('Cerrado por el usuario');
          }
        }
      ]
    });

    await alert.present();

    let count = 5;
    const intervalId = setInterval(() => {
      count--;
      //alert.
      const contador = count;
      alert.message = `${ mensaje.slice(0, -(5-count)) }`;
      (alert.buttons[0] as AlertButton).text = `Cerrar en ${count}`;
      // const newBookName = mensaje.slice(0, -1)
      if (count === 0) {
        clearInterval(intervalId);
        alert.dismiss();
      }
    }, 1000);


    /*setTimeout(() => {
      if (!this.alertclosed) {
        alert.dismiss()
        this.alertclosed = false;
      }
    }, 5000);*/
  }


  newObjAspirante() {

    let aspirante = {}
    aspirante['asp_cedula'] = null
    aspirante['asp_codigo'] = null
    aspirante['asp_nombres'] = null
    aspirante['asp_apellidop'] = null
    aspirante['asp_apellidom'] = null
    aspirante['asp_pais'] = null
    aspirante['asp_sexo'] = null
    aspirante['asp_edad'] = null
    aspirante['asp_correo'] = null
    aspirante['asp_ecivil'] = null
    aspirante['asp_gpo_sanguineo'] = null
    aspirante['asp_cargo'] = null
    aspirante['asp_sueldo'] = null
    aspirante['asp_conadis'] = null
    aspirante['asp_nro_conadis'] = null
    aspirante['asp_discapacidad'] = null
    aspirante['asp_porcentaje'] = null
    aspirante['asp_experiencia'] = null
    aspirante['asp_nmb_experiencia'] = null
    aspirante['asp_ing_entrevista'] = null
    aspirante['asp_fch_ingreso'] = null
    aspirante['asp_telefono'] = null
    aspirante['asp_direccion'] = null
    aspirante['asp_hora_entrevista'] = null
    aspirante['asp_referencia'] = null
    aspirante['asp_estado'] = 0
    aspirante['asp_observaciones'] = null
    aspirante['asp_observacion_medico'] = null
    aspirante['asp_observacion_final'] = null
    aspirante['asp_academico'] = null
    aspirante['asp_fecha_nacimiento'] = null
    aspirante['asp_militar'] = null
    aspirante['asp_aprobacion'] = "false"
    aspirante['asp_evaluacion'] = null
    aspirante['asp_condicion'] = null
    aspirante['asp_lugar_nacimiento'] = null
    aspirante['asp_etnia'] = null
    aspirante['asp_religion'] = null
    aspirante['asp_banco'] = null
    aspirante['asp_nro_cuenta'] = null
    aspirante['asp_nombre_familiar'] = null
    aspirante['asp_parentezco_familiar'] = null
    aspirante['asp_telefono_familiar'] = null
    aspirante['asp_descripcion_vivienda'] = null
    aspirante['asp_referencia_vivienda'] = null
    aspirante['asp_cargas'] = null
    aspirante['asp_cargas_primaria'] = null
    aspirante['asp_cargas_secundaria'] = null
    aspirante['asp_vivienda'] = null
    aspirante['asp_construccion'] = null
    aspirante['asp_movilizacion'] = null
    aspirante['asp_recomendado'] = null

    aspirante['atv_aspirante'] = null
    aspirante['atv_fingreso'] = null
    aspirante['atv_fverificado'] = null
    aspirante['atv_plegales'] = "false"
    aspirante['atv_pfiscalia'] = "false"
    aspirante['atv_ppenales'] = "false"
    aspirante['atv_plaborales'] = "false"
    aspirante['atv_verificado'] = "false"
    aspirante['atv_aprobado'] = "NO"

    return aspirante
  }

}


