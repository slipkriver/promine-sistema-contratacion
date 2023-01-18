import { Injectable, EventEmitter } from '@angular/core';

//import 'rxjs-compat/add/operator/map';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';

import { Storage } from '@ionic/storage-angular';

@Injectable({
    providedIn: 'root'
})
export class DataLocalService {


    isloading = false
    submenu$ = new EventEmitter<any[]>()
    cambioMenu$ = new EventEmitter<String>()
    submenu = []

    aspirantes: any = [];

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
        this.aspirantes = this.getAspirantes();
        this.userConfig = this.getUserConfig();
        setTimeout(() => {
            //console.log("**DATA Local = ",this.userConfig)

        }, 3000);

    }

    getAspirantes() {
        //this.localStorage.set(modo, { 'lng': lng.toString(), 'lat': lat.toString(), 'lugar': '' })
        return this._storage.get('aspirantes').then(async (val) => {
            if (!!val) {
                this.aspirantes = val;
            } else {
                this.aspirantes = [];
            }

            //this.filterEstado('tthh', 0)
            console.log("OK Local data")
            return await this.aspirantes;
        })
    }

    async getAspirante(cedula) {
        let flag = false;
        let aspirante = {}
        await this.aspirantes

        if (this.aspirantes.length > 0) {
            //this.aspirantes = val;
            this.aspirantes.forEach(item => {
                if (item['asp_cedula'] === cedula) {
                    flag = true;
                    aspirante = item;
                    return item;
                }
            });

            if (!flag) {
                aspirante = this.aspirantes[0];
            }
            //console.log(flag, aspirante)

            return aspirante;

        } else {
            setTimeout(() => {
                this.getAspirante(cedula)
                return;
            }, 1000);
            //aspirante = {};
        }

        //this.filterEstado('tthh', 0)

    }

    async getUltimo() {

        //this.localStorage.set(modo, { 'lng': lng.toString(), 'lat': lat.toString(), 'lugar': '' })
        await this.aspirantes
        //console.log(this.aspirantes[])
        // return this._storage.get('aspirantes').then((val) => {
        if (this.aspirantes.length) {
            //console.log(this.aspirantes[0].asp_fecha_modificado)
            //const ultimo = new Date();
            const max_start_time =
                new Date(Math.max.apply(null,
                    this.aspirantes.map(item =>
                        item["asp_fecha_modificado"]
                    ).map(fecha => new Date(fecha))));

            console.log(max_start_time);

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

    async guardarAspirante(value: any, nuevo=false) {

        //return
        console.log(nuevo, value, this.aspirantes.length )

        if (value.length >= 0) {

            if (this.aspirantes.length == 0) {
                this.aspirantes = value;
                this._storage.set('aspirantes', this.aspirantes)
                return
            }

            if (nuevo) {
                console.log(value[0])
                this.aspirantes.push(value[0]);

            } else {

                value.forEach(async aspirante => {
                    let flag = false

                    //aspirante.asp_fecha_modificado = (this.aspirante.asp_id) aspirante.asp_fecha_modificado.substring(0, 19).replace('T', ' ') || aspirante.asp_fecha_modificado;
                    const ultimoModificado = await this.aspirantes.findIndex(
                        (item) => item.asp_cedula === aspirante['asp_cedula']
                    )

                    if (ultimoModificado > -1) {
                        this.aspirantes[ultimoModificado] = aspirante;
                        flag = true;
                    }
                    //console.log(lastBookIndex, 'END Foreach -> ', flag)

                    //console.log(this.aspirantes);

                });
            }

            this._storage.set('aspirantes', this.aspirantes)

            //this.filterEstado('tthh', 0)

        }


    }

    filterEstado(departamento, estado, historial) {

        let lista = [];

        // console.log(departamento, estado, historial)

        switch (departamento) {
            case 'tthh':
                if (estado == 0) {
                    lista = this.aspirantes.filter((obj) => {
                        const fecha: string = obj.asp_fecha_modificado
                        obj.asp_fecha_modificado = this.changeFormat(fecha);
                        return (obj.asp_estado === 'INGRESADO' || obj.asp_estado === 'EXAMENES'
                            || obj.asp_estado === 'APROBADO' || obj.asp_estado === 'REVISION'
                            && obj.asp_aprobacion === 'false');
                    });
                }
                if (estado == 1 || estado == 2 && historial == true) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.est_id >= estado);
                    });
                }

                if (estado == 3 && historial == true) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === "NO APROBADO" || obj.atv_aprobado === "NO");
                    });
                }

                if (estado == 4) {
                    lista = this.aspirantes.filter((obj) => {
                        if (historial == true) {
                            return (obj.amv_verificado === 'true' && obj.amv_valoracion !== 'NO APTO');
                        } else {
                            return (obj.amv_valoracion !== "NO APTO");
                        }
                    });
                }

                if (estado == 5) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === "NO APTO");
                    });
                }
                break;

            case 'medi':
                //console.log(estado,"medi")
                if (estado == 0) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === 'VERIFICADO');
                    });
                }
                if (estado == 1) {
                    if (historial == true) {
                        lista = this.aspirantes.filter((obj) => {
                            return (obj.amv_verificado === 'true' && obj.amv_valoracion !== 'NO APTO');
                        });
                    } else {
                        lista = this.aspirantes.filter((obj) => {
                            return (obj.asp_estado === 'EXAMENES');
                        });
                    }
                }
                if (estado == 2) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === 'NO APTO');
                    });
                }
                break;
            case 'psico':
                //console.log(estado)
                if (estado == 0) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === 'PSICOLOGIA');
                    });
                }
                if (estado == 1) {
                    if (historial == true) {
                        lista = this.aspirantes.filter((obj) => {
                            return (obj.apv_verificado === 'true' && obj.apv_valoracion !== 'NO APTO');
                        });
                    } else {
                        lista = this.aspirantes.filter((obj) => {
                            return (obj.asp_estado === 'REVISION');
                        });
                    }
                }
                if (estado == 2) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === 'NO ADMITIDO');
                    });
                }
                break;
            case 'segu':
                if (estado == 0) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === 'REVISION' && obj.asp_aprobacion === 'true');
                    });
                }
                break;
            case 'soci':
                if (estado == 0) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === 'CONTRATADO');
                    });
                }
                break;

            default:
                break;
        }

        if (estado != 0 && departamento === 'tthh' && historial == false) {
            lista = this.aspirantes.filter((obj) => {
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

}