import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//import 'rxjs-compat/add/operator/map';
import { Observable } from 'rxjs';
import { LoadingController, AlertController } from '@ionic/angular';

import { Storage } from '@ionic/storage-angular';

@Injectable({
    providedIn: 'root'
})
export class DataLocalService {


    isloading = false
    submenu$ = new EventEmitter<any[]>()
    cambioMenu$ = new EventEmitter<String>()
    submenu = []

    private _storage: Storage | null = null;

    constructor(

        private storage: Storage

    ) {
        this.init();
    }

    async init() {
        // If using, define drivers here: await this.storage.defineDriver(/*...*/);
        const storage = await this.storage.create();
        this._storage = storage;
    }

    getAspirantes() {

        //this.localStorage.set(modo, { 'lng': lng.toString(), 'lat': lat.toString(), 'lugar': '' })
        this._storage.get('aspirantes').then((val) => {
            if (val) {
                console.log(val)
            }
        })
    }

    getUltimo() {

        //this.localStorage.set(modo, { 'lng': lng.toString(), 'lat': lat.toString(), 'lugar': '' })
        this._storage.get('aspirantes').then((val) => {
            if (val) {
                console.log(val)
            }else{
                return "2022-01-01"
            }
        })
    }

    guardarAspirante(key: string, value: any) {
        this._storage?.set(key, value);
    }

}