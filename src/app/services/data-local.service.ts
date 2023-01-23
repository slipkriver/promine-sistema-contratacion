import { Injectable, EventEmitter } from '@angular/core';

//import 'rxjs-compat/add/operator/map';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

import { Storage } from '@ionic/storage-angular';
import { AspiranteInfo } from '../interfaces/aspirante';

@Injectable({
    providedIn: 'root'
})
export class DataLocalService {


    isloading = false
    submenu = []

    aspirantesLocal: any = [];
    aspirantesLocal$ = new EventEmitter<AspiranteInfo[]>();


    private _storage: Storage | null = null;

    pipe = new DatePipe('en-US');

    userConfig: any = {};

    constructor(

        private storage: Storage

    ) {

        //console.log("**Constructor data-Local")
        this.init();
    }

    async init() {
        // If using, define drivers here: await this.storage.defineDriver(/*...*/);

        const storage = await this.storage.create();
        this._storage = storage;
        this.userConfig = this.getUserConfig();
        this.aspirantesLocal = this.getAspirantes();

    }

    getAspirantes() {
        //this.localStorage.set(modo, { 'lng': lng.toString(), 'lat': lat.toString(), 'lugar': '' })
        // return this._storage.get('aspirantes').then((val) => {

        return this._storage.get('aspirantes').then(async (val) => {
            if (!!val) {
                this.aspirantesLocal = val;
            } else {
                this.aspirantesLocal = [];
            }

            //this.filterEstado('tthh', 0)
            console.log("OK Local data", val?.length)
            this.aspirantesLocal$.emit(this.aspirantesLocal);

        });
    }

    async getAspirante(cedula) {
        let flag = false;
        let aspirante = {}
        await this.aspirantesLocal

        if (this.aspirantesLocal.length > 0) {
            //this.aspirantes = val;
            this.aspirantesLocal.forEach(item => {
                if (item['asp_cedula'] === cedula) {
                    flag = true;
                    aspirante = item;
                    return item;
                }
            });

            if (!flag) {
                aspirante = this.aspirantesLocal[0];
            }
            console.log(flag, aspirante)

            return aspirante;

        } else {
            //aspirante = {};
        }

        //this.filterEstado('tthh', 0)

    }

    getUltimo() {

        //this.localStorage.set(modo, { 'lng': lng.toString(), 'lat': lat.toString(), 'lugar': '' })
        this.aspirantesLocal
        //console.log(this.aspirantes[])
        // return this._storage.get('aspirantes').then((val) => {
        if (this.aspirantesLocal.length) {
            //console.log(this.aspirantes[0].asp_fecha_modificado)
            //const ultimo = new Date();
            const max_start_time =
                new Date(Math.max.apply(null,
                    this.aspirantesLocal.map(item =>
                        item["asp_fecha_modificado"]
                    ).map(fecha => new Date(fecha))));

            //console.log(max_start_time);

            return this.changeFormat(max_start_time);
        } else {
            return "2022-01-01 00:00:00"
        }
        // })
    }

    changeFormat(today) {
        let ChangedFormat = this.pipe.transform(today, 'YYYY-MM-dd HH:mm:ss');
        //console.log(ChangedFormat);
        return ChangedFormat;
    }

    async guardarAspirante(value: any, nuevo = false) {

        //return
        console.log(nuevo, value.length, this.aspirantesLocal.length)

        if (value.length >= 0) {

            if (!this.aspirantesLocal?.length || this.aspirantesLocal?.length == 0) {
                this.aspirantesLocal = value;
                this._storage.set('aspirantes', this.aspirantesLocal)
                this.aspirantesLocal$.emit(this.aspirantesLocal);

                return;
            }

            if (nuevo) {
                console.log(value[0])
                this.aspirantesLocal.push(value[0]);
            } else {

                value.forEach(async aspirante => {
                    let flag = false

                    //aspirante.asp_fecha_modificado = (this.aspirante.asp_id) aspirante.asp_fecha_modificado.substring(0, 19).replace('T', ' ') || aspirante.asp_fecha_modificado;
                    const ultimoModificado = await this.aspirantesLocal.findIndex(
                        (item) => item.asp_cedula === aspirante['asp_cedula']
                    )

                    if (ultimoModificado > -1) {
                        this.aspirantesLocal[ultimoModificado] = aspirante;
                        flag = true;
                    }else{
                        this.aspirantesLocal.push(aspirante);
                    }
                    //console.log(lastBookIndex, 'END Foreach -> ', flag)


                });
            }

            console.log(await this.aspirantesLocal);

            this._storage.set('aspirantes', this.aspirantesLocal)
            this.aspirantesLocal$.emit(this.aspirantesLocal);

            //this.filterEstado('tthh', 0)

        }


    }

    filterEstado(departamento, estado, historial) {

        let lista = [];

        // console.log(departamento, estado, historial)

        switch (departamento) {
            case 'tthh':
                if (estado == 0) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        const fecha: string = obj.asp_fecha_modificado
                        obj.asp_fecha_modificado = this.changeFormat(fecha);
                        return (obj.asp_estado === 'INGRESADO' || obj.asp_estado === 'EXAMENES'
                            || obj.asp_estado === 'APROBADO' || obj.asp_estado === 'REVISION'
                            && obj.asp_aprobacion === 'false');
                    });
                }
                if (estado == 1 || estado == 2 && historial == true) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        return (obj.est_id >= estado);
                    });
                }

                if (estado == 3 && historial == true) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        return (obj.asp_estado === "NO APROBADO" || obj.atv_aprobado === "NO");
                    });
                }

                if (estado == 4) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        if (historial == true) {
                            return (obj.amv_verificado === 'true' && obj.amv_valoracion !== 'NO APTO');
                        } else {
                            return (obj.amv_valoracion !== "NO APTO");
                        }
                    });
                }

                if (estado == 5) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        return (obj.asp_estado === "NO APTO");
                    });
                }
                break;

            case 'medi':
                //console.log(estado,"medi")
                if (estado == 0) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        return (obj.asp_estado === 'VERIFICADO');
                    });
                }
                if (estado == 1) {
                    if (historial == true) {
                        lista = this.aspirantesLocal.filter((obj) => {
                            return (obj.amv_verificado === 'true' && obj.amv_valoracion !== 'NO APTO');
                        });
                    } else {
                        lista = this.aspirantesLocal.filter((obj) => {
                            return (obj.asp_estado === 'EXAMENES');
                        });
                    }
                }
                if (estado == 2) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        return (obj.asp_estado === 'NO APTO');
                    });
                }
                break;
            case 'psico':
                //console.log(estado)
                if (estado == 0) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        return (obj.asp_estado === 'PSICOLOGIA');
                    });
                }
                if (estado == 1) {
                    if (historial == true) {
                        lista = this.aspirantesLocal.filter((obj) => {
                            return (obj.apv_verificado === 'true' && obj.apv_valoracion !== 'NO APTO');
                        });
                    } else {
                        lista = this.aspirantesLocal.filter((obj) => {
                            return (obj.asp_estado === 'REVISION');
                        });
                    }
                }
                if (estado == 2) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        return (obj.asp_estado === 'NO ADMITIDO');
                    });
                }
                break;
            case 'segu':
                if (estado == 0) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        return (obj.asp_estado === 'REVISION' && obj.asp_aprobacion === 'true');
                    });
                }
                break;
            case 'soci':
                if (estado == 0) {
                    lista = this.aspirantesLocal.filter((obj) => {
                        return (obj.asp_estado === 'CONTRATADO');
                    });
                }
                break;

            default:
                break;
        }

        if (estado != 0 && departamento === 'tthh' && historial == false) {
            lista = this.aspirantesLocal.filter((obj) => {
                return (obj.est_id == estado);
            });
        }
        //console.log(lista)
        //this.guardarAspirante([]);

        return lista
    }

    getUserConfig(propiedad?) {
        if (!!propiedad) {
            return this._storage.get('configuracion').then(async (val) => {
                if (!!val[propiedad]) {
                    return await val[propiedad];
                } else {
                    return {};
                }
            })
        }
        return this._storage.get('configuracion').then(async (val) => {
            if (!!val) {
                this.userConfig = val;
            } else {
                this.userConfig = {};
            }
            // console.log("$$ getUserConfig ++ ",val, this.userConfig);
            return await (this.userConfig || {});
        })
    }

    setConfig(atributo, newconfig) {
        //let userconfig = await this.getUserConfig()
        //console.log(newconfig,this.userConfig)
        this.userConfig[atributo] = newconfig;
        this._storage.set('configuracion', this.userConfig)

    }

    setTemporal() {

        const list = [
            {
                "asp_id": 110,
                "asp_cedula": "2222222228",
                "asp_codigo": "22222",
                "asp_nombres": "test init",
                "asp_apellidop": "backend",
                "asp_apellidom": "ready",
                "asp_pais": "ECUADOR",
                "asp_sexo": "FEMENINO",
                "asp_edad": "",
                "asp_correo": "aspirante1@gmail.com",
                "asp_ecivil": "SOLTERO/A",
                "asp_gpo_sanguineo": "AB+",
                "asp_cargo": "ASISTENTE DE RECURSOS HUMANOS",
                "asp_sueldo": "2222",
                "asp_conadis": "",
                "asp_nro_conadis": "",
                "asp_discapacidad": "",
                "asp_porcentaje": "",
                "asp_experiencia": "",
                "asp_nmb_experiencia": "",
                "asp_ing_entrevista": "",
                "asp_fch_ingreso": "2023-01-12 11:36:10",
                "asp_telefono": "22222222-222",
                "asp_direccion": "fhhjf h fhjf hjj",
                "asp_hora_entrevista": "",
                "asp_referencia": "ING. VALERIA MONCADA",
                "asp_estado": "INGRESADO",
                "asp_observaciones": "",
                "asp_observacion_medico": "",
                "asp_observacion_final": "",
                "asp_academico": "SECUNDARIA",
                "asp_fecha_nacimiento": "",
                "asp_militar": "NO",
                "asp_aprobacion": "false",
                "asp_evaluacion": "",
                "asp_condicion": "",
                "asp_lugar_nacimiento": "",
                "asp_etnia": "",
                "asp_religion": "",
                "asp_banco": "",
                "asp_nro_cuenta": "",
                "asp_nombre_familiar": "",
                "asp_parentezco_familiar": "",
                "asp_telefono_familiar": "",
                "asp_descripcion_vivienda": "",
                "asp_referencia_vivienda": "",
                "asp_cargas": "",
                "asp_cargas_primaria": "",
                "asp_cargas_secundaria": "",
                "asp_vivienda": "",
                "asp_construccion": "",
                "asp_movilizacion": "",
                "asp_recomendado": "",
                "asp_url_foto": "",
                "asp_fecha_modificado": "2023-01-22 00:26:47",
                "est_id": 1,
                "est_nombre": "INGRESADO",
                "est_entidad": "aspirante",
                "est_descripcion": "Verificando referencias y documentos",
                "est_color": "#00009E",
                "atv_id": 37,
                "atv_aspirante": "2222222228",
                "atv_fingreso": "2023-01-12 11:36:10",
                "atv_fverificado": "",
                "atv_plegales": "false",
                "atv_pfiscalia": "false",
                "atv_ppenales": "false",
                "atv_plaborales": "false",
                "atv_verificado": "false",
                "atv_aprobado": "NO",
                "atv_observacion": "[]",
                "amv_id": null,
                "amv_aspirante": null,
                "amv_verificado": null,
                "amv_fexamenes": null,
                "amv_evaluacion": null,
                "amv_valoracion": null,
                "amv_femision": null,
                "amv_observacion": null,
                "amv_condicion": null,
                "amv_observacion2": null,
                "amv_recomendacion": null,
                "amv_urlficha": null,
                "amv_urlhistoria": null,
                "apv_id": null,
                "apv_aspirante": null,
                "apv_concepto": null,
                "apv_aprobado": null,
                "apv_observacion": null,
                "apv_verificado": null,
                "apv_fverificado": null,
                "apv_faprobado": null,
                "apv_urlficha": null,
                "apv_urltest": null,
                "asv_id": null,
                "asv_aspirante": null,
                "asv_ingresado": null,
                "asv_fingresado": null,
                "asv_charla": null,
                "asv_fcharla": null,
                "asv_equipo": null,
                "asv_fequipo": null,
                "asv_fmodificado": null,
                "asv_observacion": null,
                "asv_urlficha": null,
                "asv_verificado": null,
                "asp_nombre": "test init backend ready"
            },
            {
                "asp_id": 108,
                "asp_cedula": "2222222227",
                "asp_codigo": "22222",
                "asp_nombres": "test init",
                "asp_apellidop": "backend",
                "asp_apellidom": "ready",
                "asp_pais": "ECUADOR",
                "asp_sexo": "FEMENINO",
                "asp_edad": "",
                "asp_correo": "aspirante1@gmail.com",
                "asp_ecivil": "SOLTERO/A",
                "asp_gpo_sanguineo": "AB+",
                "asp_cargo": "ASISTENTE DE RECURSOS HUMANOS",
                "asp_sueldo": "2222",
                "asp_conadis": "",
                "asp_nro_conadis": "",
                "asp_discapacidad": "",
                "asp_porcentaje": "",
                "asp_experiencia": "",
                "asp_nmb_experiencia": "",
                "asp_ing_entrevista": "",
                "asp_fch_ingreso": "2023-01-12 11:36:10",
                "asp_telefono": "22222222-222",
                "asp_direccion": "fhhjf h fhjf hjj",
                "asp_hora_entrevista": "",
                "asp_referencia": "ING. VALERIA MONCADA",
                "asp_estado": "INGRESADO",
                "asp_observaciones": "",
                "asp_observacion_medico": "",
                "asp_observacion_final": "",
                "asp_academico": "SECUNDARIA",
                "asp_fecha_nacimiento": "",
                "asp_militar": "NO",
                "asp_aprobacion": "false",
                "asp_evaluacion": "",
                "asp_condicion": "",
                "asp_lugar_nacimiento": "",
                "asp_etnia": "",
                "asp_religion": "",
                "asp_banco": "",
                "asp_nro_cuenta": "",
                "asp_nombre_familiar": "",
                "asp_parentezco_familiar": "",
                "asp_telefono_familiar": "",
                "asp_descripcion_vivienda": "",
                "asp_referencia_vivienda": "",
                "asp_cargas": "",
                "asp_cargas_primaria": "",
                "asp_cargas_secundaria": "",
                "asp_vivienda": "",
                "asp_construccion": "",
                "asp_movilizacion": "",
                "asp_recomendado": "",
                "asp_url_foto": "",
                "asp_fecha_modificado": "2023-01-22 00:24:18",
                "est_id": 1,
                "est_nombre": "INGRESADO",
                "est_entidad": "aspirante",
                "est_descripcion": "Verificando referencias y documentos",
                "est_color": "#00009E",
                "atv_id": 36,
                "atv_aspirante": "2222222227",
                "atv_fingreso": "2023-01-12 11:36:10",
                "atv_fverificado": "",
                "atv_plegales": "false",
                "atv_pfiscalia": "false",
                "atv_ppenales": "false",
                "atv_plaborales": "false",
                "atv_verificado": "false",
                "atv_aprobado": "NO",
                "atv_observacion": "[]",
                "amv_id": null,
                "amv_aspirante": null,
                "amv_verificado": null,
                "amv_fexamenes": null,
                "amv_evaluacion": null,
                "amv_valoracion": null,
                "amv_femision": null,
                "amv_observacion": null,
                "amv_condicion": null,
                "amv_observacion2": null,
                "amv_recomendacion": null,
                "amv_urlficha": null,
                "amv_urlhistoria": null,
                "apv_id": null,
                "apv_aspirante": null,
                "apv_concepto": null,
                "apv_aprobado": null,
                "apv_observacion": null,
                "apv_verificado": null,
                "apv_fverificado": null,
                "apv_faprobado": null,
                "apv_urlficha": null,
                "apv_urltest": null,
                "asv_id": null,
                "asv_aspirante": null,
                "asv_ingresado": null,
                "asv_fingresado": null,
                "asv_charla": null,
                "asv_fcharla": null,
                "asv_equipo": null,
                "asv_fequipo": null,
                "asv_fmodificado": null,
                "asv_observacion": null,
                "asv_urlficha": null,
                "asv_verificado": null,
                "asp_nombre": "test init backend ready"
            }
        ]

        this.guardarAspirante(list)

    }
}