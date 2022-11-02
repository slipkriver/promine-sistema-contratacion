import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import 'rxjs-compat/add/operator/map';
import { Observable } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  //server: string = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
  //serverweb: string = "https://promine-ec.000webhostapp.com/servicios";
  serverweb: string = "https://getssoma.com/servicios";
  aspirante

  isloading = false
  submenu$ = new EventEmitter<any[]>()
  cambioMenu$ = new EventEmitter<String>()
  submenu = []

  aspOpciones$ = new EventEmitter<any>()
  aspItemOpts$ = new EventEmitter<any>()

  loading;

  constructor(
    private http: HttpClient,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController

  ) { }


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

  async getItemOpciones(aspirante) {

    return new Promise((resolve, reject) => {

      this.http.get("/assets/data/item-opcion.json").subscribe((data: any[]) => {

        let listaBotones = [];
        let botones = [];

        if (aspirante.asp_estado == 'INGRESADO' || aspirante.asp_estado == 'VERIFICADO' ||
          aspirante.asp_estado == 'NO APROBADO') {

          listaBotones = ['tthh-verificar-legal', 'detalle-proceso', 'cancelar'];
          this.aspirante = this.cambiarBool(aspirante)
          aspirante = this.cambiarBool(aspirante)

        } else if (aspirante.asp_estado == 'EXAMENES' || aspirante.asp_estado == 'NO APROBADO') {

          listaBotones = ['tthh-autorizar-psico', 'detalle-proceso', 'cancelar'];
          

        } else if (aspirante.asp_estado == 'PSICOLOGIA' || aspirante.asp_estado == 'NO APTO') {

          listaBotones = ['tthh-autorizar-psico', 'detalle-proceso', 'cancelar'];
          if (aspirante.asp_estado == 'NO APTO') {
            listaBotones = ['tthh-no-apto', 'detalle-proceso', 'cancelar'];
          }

          this.getAspiranteRole(aspirante['asp_cedula'], 'tthh').subscribe(res => {
            this.aspirante = this.cambiarBool(res['aspirante'])
            aspirante = this.cambiarBool(res['aspirante'])
          })

        } else if (aspirante.asp_estado == 'REVISION') {
          
          listaBotones = ['tthh-finalizar-rev', 'detalle-proceso', 'cancelar'];

          this.getAspiranteRole(aspirante['asp_cedula'], 'tthh').subscribe(res => {
            this.aspirante = this.cambiarBool(res['aspirante'])
            aspirante = this.cambiarBool(res['aspirante'])
          })

        } else if (aspirante.asp_estado == 'APROBADO') {

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
      if (aspirante[key] == "true") {
        aspirante[key] = true
        // console.log(key, aspirante[key], index);
      } else if (aspirante[key] == "false") {
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
      aspirante[key] = value.toString().trim()
      if (key.substring(0, 4) == "asp_") {
        aspirante[key] = value.toString().toUpperCase()
      }
    });

    //aspirante['asp_estado']
    body = { ...aspirante, task: 'nuevo' };
    body['asp_edad'] = body['asp_edad'].toString()

    //console.log(JSON.stringify(body))
    return this.http.post(this.serverweb + "/aspirante.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  updateAspirante(aspirante) {
    let body

    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      if (key.substring(0, 4) == "asp_") {
        aspirante[key] = value.toString().toUpperCase()
      } else if (key.substring(0, 4) == "atv_") {
        aspirante[key] = value.toString()
      }
    });

    //aspirante['asp_estado']
    body = { ...aspirante, task: 'actualizar' };
    body['asp_edad'] = body['asp_edad'].toString()

    //console.log(JSON.stringify(body))  
    return this.http.post(this.serverweb + "/aspirante.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  verifyTalento(aspirante) {
    this.mostrarLoading()
    let body

    let objTalento = {}

    Object.entries(aspirante).forEach(([key, value], index) => {
      // 👇️ name Tom 0, country Chile 1
      if (key.substring(0, 4) == "atv_") {
        objTalento[key] = value.toString()
      }
    });

    objTalento['asp_estado'] = aspirante['asp_estado']
    body = { ...objTalento, task: 'talentoh1' };

    //console.log(body)
    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(body))
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
      if (key.substring(0, 4) == "apv_") {
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

  listarPorEstado(id_estado) {
    let body

    //aspirante['asp_estado']
    body = { task: 'listarporestado', id_estado: id_estado };
    //body['asp_edad'] = body['asp_edad'].toString()

    //console.log(JSON.stringify(body))  
    return this.http.post(this.serverweb + "/aspirante.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  listadoPorDepartamento(estado, id) {
    let body

    //aspirante['asp_estado']
    body = { task: 'aspiranterol', asp_estado: estado, estado: id };
    //body['asp_edad'] = body['asp_edad'].toString()

    //console.log(estado, id)  
    return this.http.post(this.serverweb + "/validaciones.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  getAspirante(cedula) {
    let body

    //aspirante['asp_estado']
    body = { task: 'obtener', texto: cedula };
    //body['asp_edad'] = body['asp_edad'].toString()

    //console.log(JSON.stringify(body))  
    return this.http.post(this.serverweb + "/aspirante.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

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

    //aspirante['asp_estado']
    const body = { task: 'listarresponsables' };
    //body['asp_edad'] = body['asp_edad'].toString()

    //console.log(JSON.stringify(body))  
    return this.http.post(this.serverweb + "/sistema.php", JSON.stringify(body))
    // .subscribe( res => {
    //   console.log(res, body)  
    // });

  }

  async mostrarLoading(mensaje?) {
    //console.log(this.isloading,mensaje);

    if (this.isloading == true) return;

    this.isloading = true;
    let message = (!!mensaje) ? mensaje : 'Espere por favor mientras se carga la informacion...';
    this.loading = await this.loadingCtrl.create({
      message,
      duration: 5000,
      spinner: 'circles'
    });

    this.loading.present();
  }

  async cerrarLoading() {

    if (this.isloading == false) return;

    this.isloading = false

    setTimeout(() => {
      this.loading.dismiss()
    }, 500);
  }


  async presentAlert(titulo, mensaje) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      //subHeader: 'Subtitle',
      cssClass: ['alertExamenes', 'alertMensaje'],
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


