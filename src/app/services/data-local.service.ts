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

    constructor(

        private storage: Storage

    ) {
        this.init();
    }

    async init() {
        // If using, define drivers here: await this.storage.defineDriver(/*...*/);
        const storage = await this.storage.create();
        this._storage = storage;
        this.aspirantes = this.getAspirantes();
    }

    getAspirantes() {
        //this.localStorage.set(modo, { 'lng': lng.toString(), 'lat': lat.toString(), 'lugar': '' })
        return this._storage.get('aspirantes').then(async (val) => {
            if (!!val) {
                this.aspirantes = val;
            } else {
                this.aspirantes = [];
            }
            //console.log(this.aspirantes)

            //this.filterEstado('tthh', 0)

            return await this.aspirantes;
        })
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

    async guardarAspirante(value: any) {

        if (value.length > 0) {

            if (this.aspirantes.length == 0) {
                this.aspirantes = value;
                this._storage.set('aspirantes', this.aspirantes)
                return;
            }

            value.forEach(element => {
                let flag = false

                const lastBookIndex = this.aspirantes.findIndex(
                    (book) => book.asp_cedula === element['asp_cedula']
                )

                if (lastBookIndex > -1) {
                    this.aspirantes[lastBookIndex] = element;
                    flag = true;
                }
                //console.log(lastBookIndex, 'END Foreach -> ', flag)

                if (flag == false) {
                    console.log(this.aspirantes);
                    this.aspirantes.push(element);
                }

            });

            //this.filterEstado('tthh', 0)
            this._storage.set('aspirantes', this.aspirantes)

        }


    }


    filterEstado(departamento, estado) {

        let lista = [];

        switch (departamento) {
            case 'tthh':
                if (estado == 0) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === 'INGRESADO' || obj.asp_estado === 'EXAMENES'
                            || obj.asp_estado === 'APROBADO' || obj.asp_estado === 'REVISION'
                            && obj.asp_aprobacion === 'false');
                    });
                }
                break;
            case 'medi':
                if (estado == 0) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === 'VERIFICADO');
                    });
                }
                break;
            case 'psico':
                if (estado == 0) {
                    lista = this.aspirantes.filter((obj) => {
                        return (obj.asp_estado === 'PSICOLOGIA');
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

        if (estado != 0) {
            console.log(departamento, estado)

            lista = this.aspirantes.filter((obj) => {
                return (obj.est_id == estado);
            });
        }
        //console.log(lista)
        return lista
    }
}